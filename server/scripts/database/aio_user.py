import aiosqlite
import functools
from typing import Optional

from scripts.libs import LOGGER, CONF
from .aio_users_sheet import AIO_Users_Sheet
from .aio_user_settings_sheet import AIO_User_Settings_Sheet

def require_connection(func):
    """
    装饰器：在执行被装饰方法之前,判断 self.conn 是否为 None。
    如果是 None,则记录日志并直接返回 None,不执行方法体。
    """
    @functools.wraps(func)
    async def wrapper(self, *args, **kwargs):
        if self.conn is None:
            LOGGER.warning(f"Connection is None. Skipping execution of '{func.__name__}'.")
            return None
        return await func(self, *args, **kwargs)
    return wrapper


class AIO_User_Database:
    def __init__(self) -> None:
        # 简单的配置
        
        self.users: Optional[AIO_Users_Sheet] = None
        self.settings: Optional[AIO_User_Settings_Sheet] = None
        self.conn: Optional[aiosqlite.Connection] = None
        self.database_name = CONF.get_database_path('user.db')
        

    async def initialize(self):
        '''
        异步初始化,连接数据库并创建各个表
        '''
        # 初始时,异步连接数据库
        self.conn = await aiosqlite.connect(self.database_name)
        if self.conn is None:
            return
        
        # 创建表
        self.users = AIO_Users_Sheet(self.conn)
        await self.users.init_sheet()
        await self.config_admin()

        self.settings = AIO_User_Settings_Sheet(self.conn)
        await self.settings.init_sheet()
    
    @require_connection
    async def destroy(self):
        '''
        关闭资源
        '''
        await self.conn.close()
        LOGGER.info(f"Close the user database.")
    
    @require_connection
    async def config_admin(self):
        '''
        初始化时候配置一下admin的内容到数据库
        '''

        exist = await self.users.check_user_exists(CONF.username, CONF.password)
        if not exist:
            await self.users.add_user(CONF.username, CONF.password)

    @require_connection
    async def get_sheet_data(self, sheet: str) -> None:
        '''
        找出一个 sheet 的全部内容
        '''
        async with self.conn.execute(f"SELECT * FROM {sheet}") as cursor:
            rows = await cursor.fetchall()
            LOGGER.info(f"{sheet} all information: {rows}")

    @require_connection
    async def login(self, username: str, password: str) -> bool:
        ''' 
        登录数据库
        '''
        exists = await self.users.check_user_exists(username, password)
        return exists

    @require_connection
    async def get_chat_models(self, username: str) -> str:
        '''
        根据指定的用户名获取 chat_models 的值
        '''
        return await self.settings.get_chat_models(username)

    @require_connection
    async def set_chat_models(self, username: str, data: str) -> bool:
        '''
        根据指定的用户名设置 chat_models 的值
        '''
        return await self.settings.set_chat_models(username, data)

    @require_connection
    async def get_image_models(self, username: str) -> str:
        '''
        根据指定的用户名获取 image_models 的值
        '''
        return await self.settings.get_image_models(username)

    @require_connection
    async def set_image_models(self, username: str, data: str) -> bool:
        '''
        根据指定的用户名设置 image_models 的值
        '''
        return await self.settings.set_image_models(username, data)

    @require_connection
    async def get_rt_audio_models(self, username: str) -> str:
        '''
        根据指定的用户名获取 rt_audio_models 的值
        '''
        return await self.settings.get_rt_audio_models(username)

    @require_connection
    async def set_rt_audio_models(self, username: str, data: str) -> bool:
        '''
        根据指定的用户名设置 rt_audio_models 的值
        '''
        return await self.settings.set_rt_audio_models(username, data)

    @require_connection
    async def get_app_theme(self, username: str) -> str:
        '''
        根据指定的用户名获取 app_theme 的值
        '''
        return await self.settings.get_app_theme(username)

    @require_connection
    async def set_app_theme(self, username: str, data: str) -> bool:
        '''
        根据指定的用户名设置 app_theme 的值
        '''
        return await self.settings.set_app_theme(username, data)

    @require_connection
    async def get_app_network(self, username: str) -> str:
        '''
        根据指定的用户名获取 app_network 的值
        '''
        return await self.settings.get_app_network(username)

    @require_connection
    async def set_app_network(self, username: str, data: str) -> bool:
        '''
        根据指定的用户名设置 app_network 的值
        '''
        return await self.settings.set_app_network(username, data)



USER_DATABASE = AIO_User_Database()