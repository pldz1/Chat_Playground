'''
从core中引入ChatHandle并且将其中的实现转换为FastAPI操作的异步方法
'''
import json
from typing import Tuple, List
from .core import ChatHandle
from .params import Params
from openai.types.chat import ChatCompletion
from scripts.libs import LOGGER
from scripts.libs.consts import ChatRoles
from scripts.libs.cuuid import oruuid
from scripts.libs.bms import ChatAPIMessage
from scripts.modules.sql import UserSQL, ChatSQL
from scripts.modules.network import HttpxProxy


class ChatAPI(ChatHandle):
    def __init__(self, user: str, userSql: UserSQL, chatSql: ChatSQL, httpxp: HttpxProxy) -> None:
        super().__init__()

        self.userName = user                        # 当前的用户名
        self.userSql = userSql                      # 操作用户行为的数据库的句柄
        self.chatSql = chatSql                      # 操作对话数据的句柄
        self.httpxp = httpxp                        # 操作对话网络设置的句柄
        self.params = Params()                      # 存放当前对话的所有配置参数
        self.chatCid = ''                           # chatCid 表示这一个对话的唯一ID
        self.chatMessages = []                      # 存放当前对话要发送的提示消息

    async def chatStreamAPI(self):
        '''进行流式对话,不需要接受meesgae, 这个函数是setUserMsg之后调用的, 此时已经从数据库获取prompt'''
        chatIid = oruuid()
        response: List[ChatCompletion] = self.chatStream(self.chatMessages,
                                                         max_tokens=self.params.curPrms.maxResponseTokens,
                                                         temperature=self.params.curPrms.temperature,
                                                         top_p=self.params.curPrms.topP,
                                                         stop=self.params.curPrms.stopSequenceList,
                                                         frequency_penalty=self.params.curPrms.frequecyPenaty,
                                                         presence_penalty=self.params.curPrms.presentPenaty)

        allMessages = ''
        allToken = 0

        for chunk in response:
            try:
                choice = chunk.choices
                if choice == []:
                    continue

                chunkMsg = chunk.choices[0].delta.content

                # 过滤掉为None的信息, 然后拼接
                if chunkMsg != None:
                    chunkToken = self.params.getStrTokens(chunkMsg)
                    allMessages += chunkMsg
                    allToken += chunkToken

                    yield chunkMsg, chunkToken, chatIid

            except Exception as eMsg:
                LOGGER.error(f"Chat API error! {eMsg} ")
                continue

        # 更新数据库的值
        await self.storeAssResponseMessage(chatIid, allMessages, allToken)

    async def getChatModelList(self) -> list:
        '''返回当前用户下能够用上的模型列表 注意 如果是dataclass需要转成dict'''
        return self.params.getModelDictList()

    async def getAllChat(self):
        '''返回当前用户下的全部chat的关系, chat数据库的id和chat名称的关系是一个元组
         元组格式位(cid, cname)
        '''
        crlist = self.userSql.getAllChatCidNChatParams(self.userName)
        rea = []
        for cr in crlist:
            tmpPrms = json.loads(cr[1])
            rea.append({'chatCid': cr[0], 'chatName': tmpPrms["chatName"]})
        return rea

    async def addNewChat(self) -> str:
        '''根据对话名称创立对话的表, 创建成功会返回一个特意的chatCid给到WEB
         这个chatCid可以用来作为SSE/Websocket请求的URL参数,来做流更新对话的区分
        '''
        tmpPrmStr: str = json.dumps(self.params.getCurrentParams())
        # 将最开始的配置参数存入数据库, 其实可以不放入任何内容,但是只是保证操作的统一
        chatCid = self.userSql.addChatInfoForSpecUser(self.userName, tmpPrmStr)

        # 创建一个存放这个新对话的表单到chatSQL里
        self.chatSql.createTableByUserNameNChatCid(self.userName, chatCid)
        self.chatCid = chatCid

        return chatCid

    async def getSpecChatHistory(self, chatCid) -> Tuple[list, int, bool, str]:
        '''根据对话的Cid,也就是这个对话的唯一id, 加载特定的消息
        后面用到的 `msgList` 其中每个msg的格式是元组: `msg = (1, 'TYR_YGHGH', '{"role":"system", "content":xxxx}', 10)`
         - msg[0]是数据库的id位,
         - msg[1]是chatIid
         - msg[2]是消息,
         - msg[3]是tokens数量
        '''
        flag = self.userSql.checkChatCidbyUserName(self.userName, chatCid)
        if not flag:
            return [], 0, False, 'Chat has been deleted by others.'

        msgList = self.chatSql.getAllItemInSpecTable(self.userName, self.chatCid)
        # 获取chatHistory
        chatHistoy = []
        tokens = 0
        for lenI in range(0, len(msgList)):
            item = msgList[lenI]
            chatHistoy.append(
                {'chatIid': item[1], 'message': json.loads(item[2])})

            # 达到可以计算tokens的下标
            if lenI >= len(msgList) - self.params.curPrms.passedMsgLen:
                tokens += item[3]

        return chatHistoy, tokens, True, 'successfully.'

    async def getChatDefaultParams(self) -> dict:
        '''获取对话里的默认的对话参数'''
        return self.params.getDefaultParams()

    async def setChatDefaultParams(self, data) -> dict:
        '''设置对话里的默认的对话参数'''
        self.params.setDefaultParams(data)
        # LOGGER.info(f"Current defalt params: {data}")

    async def updateHttpx(self, httpxp: HttpxProxy):
        '''更新当前对话的网络代理的handler'''
        self.httpxp = httpxp
        self.updateModel(self.params.chatApi, self.httpxp.client)

    async def getChatParams(self, chatCid) -> dict:
        '''根据用户名和唯一的对话ChatCid来从数据库中加载对话的配置
         ⭐⭐⭐ 如果chatCid不为空 也代表切换对话/新建对话, 需要将当前的参数设置给chatParams
        '''
        # 新建对话返回默认的值
        if chatCid == "" or chatCid == None:
            return self.params.setCurrenParamsBeDefault()

        # ⭐ 切换对话 从数据库拿对话的参数
        self.chatCid = chatCid
        strData = self.userSql.getChatParamsByChatCid(chatCid)
        dictData: dict = json.loads(strData)

        self.params.updateCurrentParams(dictData)
        self.updateModel(self.params.chatApi, self.httpxp.client)

        return self.params.getCurrentParams()

    async def setChatParams(self, chatCid, data: dict) -> None:
        '''根据用户名和唯一的对话ChatCid来设置数据库中里对应条目的值
        如果chatCid对应是当前的对话,那需要更新当前的self.params的属性
        '''
        self.userSql.setChatParamsForSpecUser(chatCid, json.dumps(data))
        # 是不是要更新当前的配置和模型
        if chatCid == self.chatCid:
            self.params.updateCurrentParams(data)
            self.updateModel(self.params.chatApi, self.httpxp.client)

        # LOGGER.info(f"Current chat params: {self.params.getCurrentParams()}")

    async def setChatName(self, chatCid, chatName: str) -> None:
        '''根据用户名和唯一的对话ChatCid来设置数据库或者是当前对话的对话名称
        如果chatCid对应是当前的对话,那需要更新当前的self.params的属性
        '''
        strData = self.userSql.getChatParamsByChatCid(chatCid)
        dictData: dict = json.loads(strData)
        dictData['chatName'] = chatName

        self.userSql.setChatParamsForSpecUser(chatCid, json.dumps(dictData))

        # 是不是要更新当前的配置和模型
        if chatCid == self.chatCid:
            self.params.curPrms.chatName = chatName

        # LOGGER.info(f"Chat params: {self.params.getCurrentParams()}")
        return True

    async def setUserMsg(self, msg: ChatAPIMessage) -> tuple:
        '''将用户的消息存入数据库,然后返回对应的item的chatIid'''
        chatIid = oruuid()
        tmpTokens = self.params.getOneMsgTokens(msg)
        tokens = tmpTokens + self.params.getPrmoptsTokens()

        if tokens > self.params.chatApi.maxTokens:
            return False, '', 0
        # 先存消息
        await self.storeMessage(chatIid, msg, tmpTokens)

        # 如果是幽灵对话 不从数据库拿上下文
        if self.params.curPrms.isGhost:
            self.chatMessages = self.params.curPrms.prompts + [msg]
            return True, chatIid, tokens
        else:
            # 从数据库获取上下文需要防止一次调用API的上下文超过最大限制
            msgTupleList = self.chatSql.getLastNItemsInSpecTable(
                self.userName, self.chatCid, self.params.curPrms.passedMsgLen)
            flag, self.chatMessages, tokens = self.params.getValidMessage(msgTupleList)
            LOGGER.debug(f"{self.chatMessages}")
            return flag, chatIid, tokens

    async def storeAssResponseMessage(self, chatIid, textContent, tokens):
        '''将GPT返回的消息存入数据库,省去计算一步'''
        msg = ChatAPIMessage()
        msg['role'] = ChatRoles.ASS
        msg['content'] = [{'type': 'text', 'text': textContent}]
        msgStr = json.dumps(msg)
        self.chatSql.addItemToSpecTable(self.userName, self.chatCid, chatIid, msgStr, tokens)

    async def storeMessage(self, chatIid, msg: ChatAPIMessage, tokens):
        '''将携带tokens信息的消息存入数据库,省去计算一步'''
        tmpMsgStr = json.dumps(msg)
        self.chatSql.addItemToSpecTable(self.userName, self.chatCid, chatIid, tmpMsgStr, tokens)

    async def deleteChat(self, chatCid):
        '''根据对话名称删除对话表'''
        try:
            # 删除有关的用户操作的数据
            self.userSql.deleteChatInfoForSpecUser(self.userName, chatCid)
            # 删除存放全部对话列表的表单
            self.chatSql.deleteSpecTable(self.userName, chatCid)
            return True
        except Exception as eMsg:
            LOGGER.error(f'deleteChat error : {eMsg}')
            return False

    async def getChatItemByID(self, chatIid: str):
        '''根据用户提供的id信息来删除数据库的那条信息'''
        msg = self.chatSql.getItemInSpecTable(self.userName, self.chatCid, chatIid)
        if msg != None:
            return True, msg
        else:
            return False, ''

    async def deleteChatItemByID(self, chatIid: str):
        '''根据用户提供的id信息来删除数据库的那条信息'''
        self.chatSql.deleteItemInSpecTable(self.userName, self.chatCid, chatIid)
        return True

    async def editChatItemMsgByID(self, chatIid, msg: ChatAPIMessage):
        '''根据提供的chat的id和新消息, 对chatItem表的内容进行更新'''
        tokens = self.params.getOneMsgTokens(msg)
        msgStr = json.dumps(msg)
        self.chatSql.setItemInSpecTable(self.userName, self.chatCid, chatIid, msgStr, tokens)
        return True

    async def reGenerateContent(self, chatIid):
        '''根据提供的chat的id和新消息, 对chatItem表的内容进行更新'''
        nextItemChatIidList = self.chatSql.getItemNextInfoByUserNameNChatAllId(
            self.userName, self.chatCid, chatIid)

        if nextItemChatIidList == None:
            return False, 0, "chatIid is not exit!"

        # 开始循环从数据库中删除元素
        for iId in nextItemChatIidList:
            flag = await self.deleteChatItemByID(iId)
            if not flag:
                return False, 0, "chatIid is error"

        # 成功更新prompt
        msgTupleList = self.chatSql.getLastNItemsInSpecTable(self.userName, self.chatCid, self.params.curPrms.passedMsgLen)
        flag, self.chatMessages, tokens = self.params.getValidMessage(msgTupleList)
        return flag, tokens, "SUCCESS"

    async def downloadChatHistory(self, chatCid):
        '''根据提供的chatCid将对话给到WEB下载,注意不用附带prompts'''
        flag = self.userSql.checkChatCidbyUserName(self.userName, chatCid)
        if not flag:
            return []
        msgList = self.chatSql.getAllItemInSpecTable(self.userName, self.chatCid)
        # 获取chatHistory
        chatHistoy = [json.loads(message[2]) for message in msgList]
        return chatHistoy

    async def uploadChatHistory(self, data: dict):
        '''解析上传的json数据,用默认的模型参数开始对话'''
        allParams = json.dumps(self.params.getCurrentParams())
        # 将最开始的配置参数存入数据库, 其实可以不放入任何内容,但是只是保证操作的统一
        self.chatCid = self.userSql.addChatInfoForSpecUser(self.userName, allParams)

        self.userSql.setChatParamsForSpecUser(self.chatCid, allParams)
        self.updateModel(self.params.chatApi, self.httpxp.client)

        # 创建一个存放这个新对话的表单到chatSQL里
        self.chatSql.createTableByUserNameNChatCid(self.userName, self.chatCid)

        chatHistory = []
        chatTokens = 0

        # 开始向数据库塞入数据
        for sit in range(len(data)):
            iid = oruuid()
            msg: ChatAPIMessage = data[sit]
            tokens = self.params.getOneMsgTokens(msg)
            chatHistory.append({'chatIid': iid, 'message': msg})
            await self.storeMessage(iid, msg, tokens)

            # 更新下次要发送的tokens数量
            if sit >= len(data) - self.params.curPrms.passedMsgLen:
                chatTokens += tokens

        return self.chatCid, chatHistory, chatTokens

    async def newGhostChat(self, name: str, template: str):
        '''设置幽灵对话的参数'''
        allParams = self.params.setGhostChat(name, template)
        allParamsStr = json.dumps(allParams)
        # 将最开始的配置参数存入数据库, 其实可以不放入任何内容,但是只是保证操作的统一
        self.chatCid = self.userSql.addChatInfoForSpecUser(self.userName, allParamsStr)

        self.userSql.setChatParamsForSpecUser(self.chatCid, allParamsStr)
        self.updateModel(self.params.chatApi, self.httpxp.client)

        # 创建一个存放这个新对话的表单到chatSQL里
        self.chatSql.createTableByUserNameNChatCid(self.userName, self.chatCid)

        return self.chatCid, allParams, self.params.getPrmoptsTokens()
