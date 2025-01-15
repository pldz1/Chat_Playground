'''
##### 处理WEB的路由请求 发送跳转的response.
'''

import fastapi
from fastapi.responses import RedirectResponse


APP_ROUTE = fastapi.APIRouter()


@APP_ROUTE.get('/login')
async def loginRedirAPI():
    '''通知 WEB 跳转到登录界面'''
    return RedirectResponse(url="/login")


@APP_ROUTE.get('/chat')
async def loginRedirAPI():
    '''通知 WEB 跳转到对话界面'''
    return RedirectResponse(url="/chat")
