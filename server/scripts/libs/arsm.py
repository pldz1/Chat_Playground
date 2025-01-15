'''
#### API Response Model. 
用 Pydantic 模型来定义数据结构 约定这个项目 API 的响应数据格式
'''

from pydantic import BaseModel


class LoginAndLogoutResponse(BaseModel):
    '''login和logout的应答体'''
    flag: bool = False
    uid: str = ''
    userName: str = ''
    log: str = 'Invalid identity.'


class GetChatModelListResponse(BaseModel):
    '''getChatModelListAPI的应答体, 返回全部的列表即可'''
    flag: bool = False
    data: list = []
    log: str = ''


class AllHistoryResponse(BaseModel):
    '''allHistoryAPI的应答体, 返回全部的列表即可'''
    flag: bool = False
    data: list = []
    log: str = ''


class NewChatResponse(BaseModel):
    '''startChat响应内容的格式'''
    flag: bool = False
    chatCid: str = ''    # 用于对话的唯一标志
    log: str = ''


class SetChatNameResponse(BaseModel):
    '''setChatName响应内容的格式'''
    flag: bool = False
    log: str = ''


class GetSpecChatHistoryResponse(BaseModel):
    '''加载对话历史的函数的响应体'''
    history: list = []  # 对话的历史记录
    tokens: int = 0
    flag: bool = False
    log: str = ''


class DeleteChatResponse(BaseModel):
    '''deleteChatAPI前端response的参数'''
    flag: bool = False
    log: str = ''


class SetUserMsgResponse(BaseModel):
    '''Chat的中user的消息的应答体, 返回对话的唯一chatIid'''
    flag: bool = False
    chatIid: str = ''
    tokens: int = 0
    log: str = ''


class EditChatItemResponse(BaseModel):
    '''editChatItemAPI前端response的参数'''
    flag: bool = False
    log: str = ''


class GetChatItemResponse(BaseModel):
    '''getChatItemAPI前端response的参数'''
    flag: bool = False
    data: str = ''
    log: str = ''


class DeleteChatItemResponse(BaseModel):
    '''deletChatItemAPI前端response的参数'''
    flag: bool = False
    log: str = ''


class GetChatParamsResponse(BaseModel):
    '''getChatParamsAPI返回的response的格式'''
    flag: bool = False
    log: str = ''
    data: dict = {}


class SetChatParamsResponse(BaseModel):
    '''getChatParamsAPI返回的response的格式'''
    flag: bool = False
    log: str = ''


class ChatSSEResponse(BaseModel):
    '''Chat对话的应答体'''
    flag: int = 0       # SSE对话开始/进行中/结束的标识, 开始是1, 进行中是2, 结束是0
    data: str = ''      # 具体的内容
    tokens: int = 0
    chatIid: str = ''   # 对话对象的唯一标志


class ReGenerateContentResponse(BaseModel):
    '''ReGenerateContentAPI返回的response的格式'''
    flag: bool = False
    tokens: int = 0
    log: str = ''


class DownloadChatHistoryResponse(BaseModel):
    '''DownloadChatHistoryAPI返回的response的格式'''
    flag: bool = False
    data: list = []
    log: str = ''


class UploadChatHistoryResponse(BaseModel):
    '''uploadChatHistoryAPI返回的response的格式'''
    flag: bool = False
    chatCid: str = ''
    history: list = []
    tokens: int = 0
    log: str = ''


class NewGhostChatResponse(BaseModel):
    '''newGhostChatAPI返回的response的格式'''
    flag: bool = False
    chatCid: str = ''
    chatParams: dict = {}
    tokens: int = 0
    log: str = ''


class ChatAudioResponse(BaseModel):
    '''chatAudioAPI请求体的格式'''
    data: str = ''  # 文件名称
    flag: bool = False
    log: str = ''


class GetUserChatParamsResponse(BaseModel):
    '''getUserChatParamsAPI响应内容的格式'''
    flag: bool = False
    log: str = ''
    data: dict = {}


class SetUserChatParamsResponse(BaseModel):
    '''setUserChatParamsAPI响应内容的格式'''
    flag: bool = False
    log: str = ''


class GetUserSettingResponse(BaseModel):
    '''getUserSettingAPI响应内容的格式'''
    flag: bool = False
    log: str = ''
    data: dict = {}


class SetUserSettingResponse(BaseModel):
    '''setUserSettingAPI响应内容的格式'''
    flag: bool = False
    log: str = ''


class ChatSyncAPIsAPIResponse(BaseModel):
    '''chatSyncAPIsAPI返回的response的格式'''
    flag: bool = False
    context: str = ''
    tokens: int = 0
    log: str = ''


class deleteAllChatAPIResponse(BaseModel):
    '''deleteAllChatAPIResponse响应内容的格式'''
    flag: bool = False
    log: str = ''
