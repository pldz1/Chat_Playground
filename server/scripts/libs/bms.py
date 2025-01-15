'''
#### base models 新增的 项目的全局基础模型类文件
'''

from typing import TypedDict
from dataclasses import dataclass, field
from typing import Literal, List


@dataclass
class APIParams:
    '''
    这些参数的含义 可以参考下面的连接 [azure api调用方法](https://learn.microsoft.com/zh-cn/azure/ai-services/openai/chatgpt-quickstart)
    和 [OpenAI API模型介绍](https://platform.openai.com/docs/models/model-endpoint-compatibility)
    那么 我把下面的参数简单概括就是
     - serviceType: 服务类型, azure 还是 openai
     - modelType: 模型类型, gpt4o, whisper还是tts这些
     - apiKey: api的密钥
     - baseUrl: api的位置, 这个是OpenAI的API调用的方式特有的内容
     - endPoint: api的位置, 这个是Azure OpenAI调用API特有的 决定URL位置的参数,实际上它的作用就是baseUrl, 只是 pip3的openai包给这些不一样的参数名称
     - apiVersion: api的版本信息
     - deployment: 模型的部署信息, 这个是Azure OpenAI调用API特有的
     - maxTokens: 模型一次对话操作支持的最大上下文的tokens
    '''
    serviceType: Literal["azure", "openai"] = "openai"
    modelType: str = ''
    apiKey: str = ''
    baseUrl: str = ''
    endPoint: str = ''
    deployment: str = ''
    apiVersion: str = ''
    maxTokens: int = 0


class ChatImageContent(TypedDict):
    '''对话内容的image的信息'''
    url: str


class ChatContent(TypedDict):
    '''对话内容的主体信息'''
    type: str
    text: str
    image_url: ChatImageContent


class ChatAPIMessage(TypedDict):
    '''调用API的上下文的数据的类型'''
    role: str
    content: List[ChatContent]


@dataclass
class ChatAPIParams:
    chatName: str = "New Chat"   # 当前对话的名称
    isGhost: bool = False        # 当前这个对话是不是幽灵对话, 没有上下文记忆
    modelName: str = ''
    maxTokens: int = 0
    modelType: str = ''
    prompts: List[ChatAPIMessage] = field(default_factory=lambda: [
        {'role': 'system', 'content': [{'type': 'text', 'text': 'You are GPT-4o a large language model of OpenAI.'}]}])
    passedMsgLen: int = 6
    maxResponseTokens: int = 800
    temperature: float = 0.7
    topP: float = 0.95
    frequecyPenaty: float = 0.0
    presentPenaty: float = 0.0
    stopSequenceList: List[str] = field(default_factory=list)


@dataclass
class ChatAPIModelLabel:
    modelName: str = ''
    maxTokens: int = 0
    modelType: str = ''
