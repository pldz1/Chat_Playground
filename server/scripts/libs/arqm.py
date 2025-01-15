'''
#### API Request Model. 
用 Pydantic 模型来定义数据结构 约定这个项目 API 的请求的数据格式
'''

from pydantic import BaseModel


class SetChatNameAPIRequest(BaseModel):
    '''加载对话历史的函数的请求体'''
    chatCid: str  # 对话的名称
    chatName: str  # 新的对话名称


class GetSpecChatHistoryRequest(BaseModel):
    '''加载对话历史的函数的请求体'''
    chatCid: str  # 对话的名称


class DeleteChatRequest(BaseModel):
    '''deleteChatAPI前端请求体内的参数'''
    chatCid: str


class SetUserMsgRequest(BaseModel):
    '''Chat的中user的消息的请求体, 接受消息存入数据库, 并返回对话的唯一chatIid'''
    msg: object


class EditChatItemRequest(BaseModel):
    '''editChatItemAPI前端请求体内的参数'''
    chatIid: str    # 对话每个元素的唯一标志
    msg: object     # 新的用户问题


class GetChatItemRequest(BaseModel):
    '''getChatItemAPI前端请求体内的参数'''
    chatIid: str


class DeleteChatItemRequest(BaseModel):
    '''deletChatItemAPI前端请求体内的参数'''
    chatIid: str


class GetChatParamsRequest(BaseModel):
    '''getChatParamsAPI请求体的格式'''
    chatCid: str  # 用于对话的唯一标志


class SetChatParamsRequest(BaseModel):
    '''getChatParamsAPI请求体的格式'''
    chatCid: str  # 用于对话的唯一标志
    data: dict  # 具体的数据


class ReGenerateContentRequest(BaseModel):
    '''ReGenerateContentAPI请求体的格式'''
    chatIid: str  # 对话具体内容的唯一标志


class DownloadChatHistoryRequest(BaseModel):
    '''DownloadChatHistoryAPI请求体的格式'''
    chatCid: str  # 对话的唯一标志


class UploadChatHistoryRequest(BaseModel):
    '''uploadChatHistoryAPI请求体的格式'''
    data: object  # 对话的唯一标志


class NewGhostChatRequest(BaseModel):
    '''newGhostChatAPI请求体的格式'''
    name: str  # 这个幽灵对话的名称
    template: str  # 具体的模板是什么


class ChatAudioRequest(BaseModel):
    '''chatAudioAPI请求体的格式'''
    data: str  # 具体的模板是什么


class SetUserChatParamsAPIRequest(BaseModel):
    '''setUserChatParamsAPI函数的请求体'''
    data: object  # 新的对话名称


class SetUserSettingAPIRequest(BaseModel):
    '''setUserSettingAPI函数的请求体'''
    data: object  # 新的对话名称


class ChatSyncAPIsAPIRequest(BaseModel):
    '''chatSyncAPI函数的请求体'''
    data: object  # 新的对话名称
