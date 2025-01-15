import httpx
from openai import AzureOpenAI
from openai import OpenAI
from openai.types.chat import ChatCompletion
from scripts.libs.bms import APIParams
from scripts.libs.consts import APIServices


class BaseChatClient:
    def chat(self, messages: list, max_tokens: int, temperature: float, top_p: float, stop: list,
             frequency_penalty: float, presence_penalty: float, stream: bool):
        """
        这个方法应该由子类实现以处理聊天功能。

        参数:
        - messages (list): 要处理的消息列表。
        - max_tokens (int): 生成的最大tokens数。
        - temperature (float): 采样温度。
        - top_p (float): 核采样概率。
        - stop (list): 停止序列列表。
        - frequency_penalty (float): 频率惩罚。
        - presence_penalty (float): 出现惩罚。
        - stream (bool): 是否流式输出。
        """
        # 参数 'messages' 将在子类中使用
        raise NotImplementedError("Subclasses should implement this method")


class AzureChatClient(BaseChatClient):
    def __init__(self, endPoint, apiKey, apiVersion, deployment, httpxClient):
        self.client = AzureOpenAI(azure_endpoint=endPoint,
                                  api_key=apiKey,
                                  api_version=apiVersion,
                                  http_client=httpxClient)
        self.deployment = deployment

    def chat(self, messages: list, max_tokens: int, temperature: float, top_p: float, stop: list,
             frequency_penalty: float, presence_penalty: float, stream: bool):
        response: ChatCompletion = self.client.chat.completions.create(model=self.deployment,
                                                                       messages=messages,
                                                                       stream=stream,
                                                                       max_tokens=max_tokens,
                                                                       temperature=temperature,
                                                                       top_p=top_p,
                                                                       frequency_penalty=frequency_penalty,
                                                                       presence_penalty=presence_penalty)
        return response


class OpenAIChatClient(BaseChatClient):
    def __init__(self, model, baseURL, apiKey, httpxClient):
        self.client = OpenAI(base_url=baseURL,
                             api_key=apiKey,
                             http_client=httpxClient)
        self.model = model

    def chat(self, messages: list, max_tokens: int, temperature: float, top_p: float, stop: list,
             frequency_penalty: float, presence_penalty: float, stream: bool):
        response: ChatCompletion = self.client.chat.completions.create(model=self.model,
                                                                       messages=messages,
                                                                       stream=stream,
                                                                       max_tokens=max_tokens,
                                                                       temperature=temperature,
                                                                       top_p=top_p,
                                                                       frequency_penalty=frequency_penalty,
                                                                       presence_penalty=presence_penalty)
        return response


class ChatHandle:
    def __init__(self) -> None:
        '''默认就选用默认的模型参数'''
        self.client = None

    def updateModel(self, apiParams: APIParams, httpxClient: httpx.Client = None):
        '''设置模型'''
        if apiParams.serviceType == APIServices.OPENAI:
            self.updateOpenAIModel(model=apiParams.modelType,
                                   baseURL=apiParams.baseUrl,
                                   apiKey=apiParams.apiKey,
                                   httpxClient=httpxClient)

        if apiParams.serviceType == APIServices.AZURE:
            self.updateAzureGPTModel(endPoint=apiParams.endPoint,
                                     apiKey=apiParams.apiKey,
                                     apiVersion=apiParams.apiVersion,
                                     deployment=apiParams.deployment,
                                     httpxClient=httpxClient)

    def updateAzureGPTModel(self, endPoint, apiKey, apiVersion, deployment, httpxClient):
        '''根据最新的设置切换Azure模型'''
        self.client = AzureChatClient(
            endPoint, apiKey, apiVersion, deployment, httpxClient)

    def updateOpenAIModel(self, model, baseURL, apiKey, httpxClient):
        '''根据最新的设置切换OpenAI模型'''
        self.client = OpenAIChatClient(model, baseURL, apiKey, httpxClient)

    def chatSync(self, messages: list, max_tokens=2000, temperature=0.7, top_p=0.95, stop=[], frequency_penalty=0, presence_penalty=0) -> tuple:
        '''结合上下文进行对话的核心函数'''
        response = self.client.chat(messages, max_tokens, temperature, top_p,
                                    stop, frequency_penalty, presence_penalty, stream=False)
        return response.choices[0].message.content, response.usage.total_tokens

    def chatStream(self, messages: list, max_tokens=2000, temperature=0.7, top_p=0.95, stop=[], frequency_penalty=0, presence_penalty=0):
        '''只用于对话使用的流式输出'''
        response = self.client.chat(messages, max_tokens, temperature, top_p,
                                    stop, frequency_penalty, presence_penalty, stream=True)
        return response
