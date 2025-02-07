import os
import fastapi
import uvicorn

# from .user import USER_ROUTE
# from .chat import CHAT_ROUTE
from .app import APP_ROUTE

from scripts.libs import CONF

app = fastapi.FastAPI()
# 挂载路由
# app.include_router(USER_ROUTE)
# app.include_router(CHAT_ROUTE)
app.include_router(APP_ROUTE)


def startDevMode():
    '''设置开发模式下的一些web server的配置'''
    from fastapi.middleware.cors import CORSMiddleware

    # 启用 CORS 中间件, 配置允许跨域请求的来源
    app.add_middleware(CORSMiddleware,
                       allow_credentials=True,
                       allow_origins=["*"],  # 允许所有 跨越URL 方法
                       allow_methods=["*"],  # 允许所有 HTTP 方法
                       allow_headers=["*"],  # 允许所有 HTTP 头部
                       )


def runDev():
    '''启动fastapi webserver 服务'''
    startDevMode()
    uvicorn.run(app, host=CONF.host, port=CONF.port)


def runWithStatics():
    '''运行服务时候挂载静态资源, 注意这个内容现在都被加入到一个进程来运行'''
    staticsDir = CONF.getStaticsDirectory()

    if not os.path.exists(staticsDir):
        errorMsg = f"Failed to start the server with static files: no static resources found {staticsDir}"
        raise FileNotFoundError(errorMsg)

    # 挂载静态资源
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=CONF.getAbsPath('statics'),
              html=True), name="static")
    startDevMode()
    uvicorn.run(app, host=CONF.host, port=CONF.port)
