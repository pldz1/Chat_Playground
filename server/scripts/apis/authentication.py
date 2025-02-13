from fastapi import Depends
from fastapi.requests import Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from scripts.typedefs import T_App_Ssession
from scripts.libs import LOGGER

from scripts.database import USER_DATABASE

security = HTTPBasic()


async def authenticate_username(request: Request, credentials: HTTPBasicCredentials = Depends(security)):
    '''校验得到的请求的身份是否满足要求'''
    LOGGER.info(f"Cookies: {request.cookies}")
    LOGGER.info(f"Credentials.username: {credentials.username}")

    ssid = request.cookies.get(T_App_Ssession.SESSIONKEY, None)
    username = await USER_DATABASE.get_username_by_session_id(ssid)
    if username:
        LOGGER.info(f"Session userName: {username}")
        return username

    # 如果是无效的session 用basic判断用户名是不是对的
    if credentials.username != 'undefined':
        flag = await USER_DATABASE.login(credentials.username, credentials.password)
        # 随机测试的用户只要保证用户名和密码是一样的由Test+number组成即可
        if (flag):
            LOGGER.info(f"Basic Auth userName: {credentials.username}")
            return credentials.username

    # 如果连正确的basic auth都是错误的 那表示WEB都没有点击login按钮 失败返回401
    return None
