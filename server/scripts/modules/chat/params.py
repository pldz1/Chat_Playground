'''
#### chat内的成员, 用来记录用户一个对话里的全部配置信息
- 包括模型的参数配置
- 模型本身的类型信息
- 以及这个对话里面的对话历史, 这样就不需要频繁访问数据库获取内容
封装成类, 方便支持多个user使用
'''
import os
import copy
import json
import tiktoken
from typing import List, Tuple
from random import randint
from .template import TEMPLATES, EMOJILIST
from dataclasses import asdict
from scripts.libs import CONF
from scripts.libs.bms import *
from scripts.libs.consts import ChatMessageType

TIKTOKEN_MODEL_PATH = CONF.getAbsPath('.model')
os.environ["TIKTOKEN_CACHE_DIR"] = TIKTOKEN_MODEL_PATH


class Params:
    def __init__(self) -> None:
        self.chatApi: APIParams = APIParams()          # 调用对话API的参数
        self.curPrms = ChatAPIParams()                 # 当前对话的参数
        # 对一个用户来说 有一份默认的参数 来决定每次新建对话的 参数是什么
        self._defaultPrms = ChatAPIParams()            # 用户对于对话的默认参数
        # 3.5 -> 4.0-* 的计算方法都是一样的
        self._encoding = tiktoken.encoding_for_model('gpt-4')
        # 用户能够用上的全部对话模型列表
        self._modelList: List[ChatAPIModelLabel] = self._initChatModelList()
        self._promptsTokens: int = 0                    # 提示词的tokens数量
        self._useDefaultParams()

    def _useDefaultParams(self):
        '''使用默认值'''
        self.curPrms = copy.deepcopy(self._defaultPrms)
        self.curPrms.chatName += f' - {EMOJILIST[randint(0, 99)]}'
        _, self._promptsTokens = self.getMessagesTokens(self.curPrms.prompts)
        # 直接从 Chat 类型的 API list 里找到第一个模型参数作为对话的默认模型'''
        if len(self._modelList) > 0:
            firstItem = self._modelList[0]
            self.chatApi = CONF.apiParamsList[firstItem.modelName]
            self.curPrms.__dict__.update(firstItem.__dict__)

    def getCurrentParams(self) -> dict:
        '''获得当前用户对这个chat的配置信息,需要和前端约定,用的变量名字是一样的 这样省去了key和value分离的麻烦'''
        return copy.deepcopy(self.curPrms.__dict__)

    def getDefaultParams(self) -> dict:
        '''获得当前用户的默认chat的配置信息'''
        tmpDict = copy.deepcopy(self._defaultPrms.__dict__)
        firstLabel = self._modelList[0]
        tmpDict.update(firstLabel.__dict__)
        return tmpDict

    def setDefaultParams(self, data) -> dict:
        '''设置当前用户的默认chat的配置信息'''
        self._defaultPrms.__dict__.update(data)

    def setCurrenParamsBeDefault(self) -> dict:
        '''设置参数是用户默认设置的参数'''
        self._useDefaultParams()
        return self.getCurrentParams()

    def updateCurrentParams(self, data: dict):
        '''根据data里面包含了哪些参数就把当前实例的属性给更新'''
        oldModelLabel = self.curPrms.modelName
        self.curPrms.__dict__.update(data)
        _, self._promptsTokens = self.getMessagesTokens(self.curPrms.prompts)
        # 如果更换了模型 就需要更新APIParams的参数
        if oldModelLabel != self.curPrms.modelName:
            self.chatApi = CONF.apiParamsList[self.curPrms.modelName]

    def _initChatModelList(self) -> List[ChatAPIModelLabel]:
        '''CONF中配置的Chat的模型 是固定的 要做的是去掉*gpt*之外的 语音和视觉的模型就行'''
        rea = []
        for key in CONF.apiParamsList:
            tmpItem: APIParams = CONF.apiParamsList[key]
            # ⭐ 初略过滤一下不是作为对话的模型 https://platform.openai.com/docs/models/continuous-model-upgrades
            if "gpt" not in tmpItem.modelType:
                continue

            rea.append(ChatAPIModelLabel(
                modelName=key, maxTokens=tmpItem.maxTokens, modelType=tmpItem.modelType))

        return rea

    def getModelDictList(self) -> list:
        '''把能够使用的对话模型的列表 从 dataclass的list转成 dict的list'''
        rea = [asdict(item) for item in self._modelList]
        return rea

    def getPrmoptsTokens(self):
        '''返回当前参数设置的默认的提示词的tokens'''
        return self._promptsTokens

    def getStrTokens(self, data: str) -> int:
        '''获得字符串的tokens数量'''
        tmpTokenArray = self._encoding.encode(data)
        return len(tmpTokenArray)

    def getOneMsgTokens(self, msg: ChatAPIMessage) -> int:
        '''从消息中计算这次消息要耗的tokens数量'''
        tokens = 0
        for content in msg['content']:
            if content['type'] == ChatMessageType.TEXT:
                tokens += self.getStrTokens(content['text'])
            if content['type'] == ChatMessageType.IMAGE:
                # 图像的tokens 默认先用70 按照官网给的解释是 LOW 精度的图像 都是固定的 tokens
                tokens += 70
        return tokens

    def getMessagesTokens(self, messages: List[ChatAPIMessage]) -> Tuple[bool, int]:
        '''从要发送给API的上下文的消息中计算这次要耗的tokens数量'''
        tokens = 0
        for msg in messages:
            tokens += self.getOneMsgTokens(msg)

        if tokens > self.chatApi.maxTokens:
            return False, tokens

        return True, tokens

    def getValidMessage(self, msgTupleList: List[Tuple[int, str, str, int]]) -> Tuple[bool, List[ChatAPIMessage], int]:
        '''特定的函数,针对存在chat数据库的对话信息item来判断, 这个数值的消息是否满足tokens数量要求可以被发送'''
        flag, msgStrList, tokens = self.getMessagesStrList(msgTupleList)
        msgList = self.curPrms.prompts + [json.loads(msg) for msg in msgStrList]
        return flag, msgList, tokens

    def getMessagesStrList(self, msgList: List[Tuple[int, str, str, int]]) -> Tuple[bool, List[ChatAPIMessage], int]:
        ''' 处理数据库拿到的消息列表的内容 
        `msgList` 其中每个msg的格式是元组: `msg = (1, 'TYR_YGHGH', '{"role":"system", "content":[...]}', 'Hello!', 10)`
         - msg[0]是数据库的id位,
         - msg[1]是chatIid
         - msg[2]是消息,
         - msg[3]是tokens数量
        '''
        if len(msgList) < 1:
            return False, [], self.chatApi.maxTokens

        tmpMessages: List[str] = []
        tmpTokens = self._promptsTokens

        for lenI in range(len(msgList) - 1, -1, -1):
            tmpMsg = msgList[lenI]
            tmpMessages.append(tmpMsg[2])
            tmpTokens += tmpMsg[3]

        if tmpTokens <= self.chatApi.maxTokens:
            return True, tmpMessages, tmpTokens
        else:
            del msgList[0]
            self.getMessagesStrList(msgList)

    def setGhostChat(self, name: str, template) -> dict:
        '''特定的函数, 设置一个幽灵对话'''
        self._useDefaultParams()
        templateDict = TEMPLATES.get(template, {})
        self.updateCurrentParams({'isGhost': True, 'prompts': templateDict.get(
            'data', {}), 'passedMsgLen': 1, 'chatName': name})
        return self.getCurrentParams()
