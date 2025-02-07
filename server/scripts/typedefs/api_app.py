from pydantic import BaseModel

class T_Login_Request(BaseModel):
    '''
    登录接口请求内容的结构
    '''
    user: str = ''
    password: str = ''


class T_Login_Response(BaseModel):
    '''
    登录接口返回的结构
    '''
    flag: bool = False
    uid: str = ''
    log: str = 'Login failed.'
    role: str = 'administrator'