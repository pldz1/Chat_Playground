from pydantic import BaseModel


class T_Get_Image_Base_A_Response(BaseModel):
    '''
    基础的图像请求返回格式
    '''
    flag: bool = False
    data: list = []
    log: str = 'The server does not expect a valid value to be returned'


class T_Delete_Image_Request(BaseModel):
    '''
    删除照片的请求格式
    '''
    username: str = ''
    image_id: str = ''


class T_Push_Image_Request(BaseModel):
    '''
    增加照片到数据库的请求格式
    '''
    username: str = ''
    image_id: str = ''
    image_prompt: str = ''
    image_url: str = ''
