from pydantic import BaseModel

class T_Get_Base_A_Request(BaseModel):
    '''
    基础的 get 请求的请求体内容
    '''
    username: str = ''


class T_Get_Base_A_Response(BaseModel):
    '''
    基础的 get 请求的返回体结构
    '''
    flag: bool = False
    # data 是一个 被 JSON.Stringify(Any) 的字符串
    data: str = ""
    log: str = 'The server does not expect a valid value to be returned'


class T_Set_Base_A_Request(BaseModel):
    '''
    基础的 set 操作的请求的结构
    '''
    username: str = ''
    data: str = ''

class T_Set_Base_A_Response(BaseModel):
    '''
    基础的 set 操作的返回体结构
    '''
    flag: bool = False
    log: str = 'The server does not expect a valid value to be returned.'