'''
##### 定义整个项目中可能用到的常量
'''


class APIAuth:
    SESSIONKEY: str = '_cg_ssid'
    EXPIREDDAYS: int = 15
    maxAge = 1296000


class APIServices:
    AZURE: str = "azure"
    OPENAI: str = "openai"


class ChatRoles:
    SYS = 'system'
    USER = 'user'
    ASS = 'assistant'


class ChatMessageType:
    TEXT = 'text'
    IMAGE = 'image_url'
    IMAGEURL = 'url'
