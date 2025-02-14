from pydantic import BaseModel

class T_Get_Chat_Base_A_Response(BaseModel):
    '''
    基础的对话返回格式
    '''
    flag: bool = False
    data: list = []
    log: str = 'The server does not expect a valid value to be returned'



class T_Chat_Base_A_Request(BaseModel):
    '''
    基础的对话请求格式
    '''
    username:str = ''
    cid: str = ''
    cname: str = ''


class T_Chat_Base_B_Request(BaseModel):
    '''
    基础的对话请求格式2
    '''
    username:str = ''
    cid: str = ''

class T_Chat_Add_Message_Request(BaseModel):
    '''
    设置对话消息的请求格式
    '''
    username:str = ''
    cid: str = ''
    mid: str = ''
    message: str = ''

class T_Chat_Delete_Message_Request(BaseModel):
    '''
    删除对话消息的请求格式
    '''
    username:str = ''
    cid: str = ''
    mid: str = ''
