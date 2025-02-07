import fastapi
from scripts.modules.umm import authenticateUser, UmmAPI, SessionParams
from scripts.libs.consts import APIAuth
from scripts.libs.arqm import *
from scripts.libs.arsm import *

USER_ROUTE = fastapi.APIRouter()


@USER_ROUTE.get('/api/isExeEnv')
async def isExeEnvAPI():
    '''判断环境 直接返回用户名'''
    from scripts.libs import CONF
    if CONF.isExeEnv:
        import os
        response = fastapi.responses.JSONResponse(content={'flag': True, 'userName': os.getlogin()})
        return response
    else:
        response = fastapi.responses.JSONResponse(content={'flag': False, 'userName': ''})
    return response


@USER_ROUTE.post('/api/login')
async def loginAPI(user: str = fastapi.Depends(authenticateUser)):
    '''插件模式 fastapi.Deepends添加对身份信息的验证
    实际上 可以写成 @LOGINANLOGOUTROUTER.post('/login', dependencies=[fastapi.Depends(authenticateUser)])
    只是如果再想获取headers内的身份会再次调用fastapi.Depends(authenticateUser)
    '''
    rea = LoginAndLogoutResponse()
    if not user:
        rea.flag = False
        return rea

    rea, session = await UmmAPI.loginAPI(user)
    if not rea.flag:
        return rea

    # fastapi 设置cookie的几个办法 https://cloud.tencent.com/developer/article/1886073
    response = fastapi.responses.JSONResponse(content=rea.model_dump())
    response.set_cookie(key=APIAuth.SESSIONKEY, value=session.ssid, expires=session.expiredTime,
                        max_age=session.maxAge, httponly=True, secure=False, samesite='lax')
    return response


# ==================================================
# ⚙️ 获得用户的默认对话参数
# ==================================================


@USER_ROUTE.get('/api/user/getUserChatParams')
async def getUserChatParamsAPI(user: str = fastapi.Depends(authenticateUser)):
    rea = GetUserChatParamsResponse()
    rea.data = await UmmAPI.getUserChatDefParamsAPI(user)
    rea.flag = True
    return rea

# ==================================================
# ✏️ setUserChatParamsAPI 修改用户的默认对话参数
# ==================================================


@USER_ROUTE.post('/api/user/setUserChatParams')
async def setUserChatParamsAPI(item: SetUserChatParamsAPIRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = SetUserChatParamsResponse()
    rea.flag = await UmmAPI.setUserChatDefParamsAPI(user, item.data)
    return rea

# ==================================================
# ⚙️ getUserSettingAPI 获得用户的默认设置参数的信息
# ==================================================


@USER_ROUTE.get('/api/user/getUserSetting')
async def getUserSettingAPI(user: str = fastapi.Depends(authenticateUser)):
    rea = GetUserSettingResponse()
    rea.data = await UmmAPI.getUserSettingsAPI(user)
    rea.flag = True
    return rea

# ==================================================
# ✏️ setUserSettingAPI 修改用户的默认设置内容
# ==================================================


@USER_ROUTE.post('/api/user/setUserSetting')
async def setUserSettingAPI(item: SetUserSettingAPIRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = SetUserSettingResponse()
    rea.flag = await UmmAPI.setUserSettingsAPI(user, item.data)
    return rea


# ==================================================
# ❌ deleteAllChatAPI 删除用户全部的对话
# ==================================================


@USER_ROUTE.post('/api/user/deleteAllChat')
async def deleteAllChatAPI(user: str = fastapi.Depends(authenticateUser)):
    rea = deleteAllChatAPIResponse()
    rea.flag = await UmmAPI.deleteAllChatAPI(user)
    return rea
