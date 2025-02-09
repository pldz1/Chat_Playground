import os
import uvicorn

from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from .app import APP_ROUTE
from .user import USER_ROUTE

from scripts.libs import CONF
from scripts.database import USER_DATABASE

@asynccontextmanager
async def lifespan(app=FastAPI):
    # startup: initialize resources
    await USER_DATABASE.initialize()
    yield
    # shutdown: clean up resources
    await USER_DATABASE.destroy()

# 设置生命周期的行为
app = FastAPI(lifespan=lifespan)
# 挂载路由
app.include_router(APP_ROUTE)
app.include_router(USER_ROUTE)

def start_dev():
    '''
    设置开发模式下的一些web server的配置
    '''
    app.add_middleware(CORSMiddleware,
                       allow_credentials=True,
                       allow_origins=["*"],  # 允许所有 跨越URL 方法
                       allow_methods=["*"],  # 允许所有 HTTP 方法
                       allow_headers=["*"],  # 允许所有 HTTP 头部
                       )


def run_dev():
    '''
    启动fastapi webserver 服务
    '''
    start_dev()
    uvicorn.run(app, host=CONF.host, port=CONF.port)


def run_main():
    '''
    运行服务时候挂载静态资源, 注意这个内容现在都被加入到一个进程来运行
    '''
    statics_path = CONF.get_statics_path()
    if not os.path.exists(statics_path):
        errorMsg = f"Failed to start the server with static files: no static resources found {statics_path}"
        raise FileNotFoundError(errorMsg)

    # 挂载静态资源
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=CONF.get_statics_path('statics'),
              html=True), name="static")
    uvicorn.run(app, host=CONF.host, port=CONF.port)
