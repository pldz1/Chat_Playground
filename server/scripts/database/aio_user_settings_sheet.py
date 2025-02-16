import aiosqlite
from typing import Optional

from scripts.libs import LOGGER

class AIO_User_Settings_Sheet:
    def __init__(self, conn: Optional[aiosqlite.Connection] = None) -> None:
        '''
        管理 user_settings 表的信息,主要保存用户登录后的一些特有属性:
        - id: 数据的主键
        - username: 用户名称（唯一）
        - models: 全部的模型的字符串数据
        - app_theme: 软件的主题设置
        - app_network: 对软件的网络设置的字符串数据
        '''
        self.sheet = 'user_settings'
        self.conn: Optional[aiosqlite.Connection] = conn

    async def init_sheet(self):
        '''创建 user_settings 表（如果不存在）'''
        await self.conn.execute(f'''
            CREATE TABLE IF NOT EXISTS {self.sheet} (
                id INTEGER PRIMARY KEY,
                username TEXT UNIQUE,
                models TEXT,
                chat_ins_template_list TEXT,
                app_theme TEXT,
                app_network TEXT
            )
        ''')
        await self.conn.commit()
        
    async def get_models(self, username: str) -> str:
        '''
        根据指定的用户名获取 models 的值
        '''
        cursor = await self.conn.execute(
            f'SELECT models FROM {self.sheet} WHERE username = ?', (username,)
        )
        row = await cursor.fetchone()
        if row:
            LOGGER.info(f"Retrieved models for {username}.")
            return row[0]
        LOGGER.warning(f"models for {username} not found.")
        return ""

    async def set_models(self, username: str, data: str) -> bool:
        '''
        根据指定的用户名设置 models 的值
        '''
        cursor = await self.conn.execute(
            f'SELECT id FROM {self.sheet} WHERE username = ?', (username,)
        )
        row = await cursor.fetchone()
        if row:
            await self.conn.execute(
                f'UPDATE {self.sheet} SET models = ? WHERE username = ?',
                (data, username)
            )
            await self.conn.commit()
            LOGGER.info(f"Updated models for {username}.")
            return True
        else:
            await self.conn.execute(
                f'INSERT INTO {self.sheet} (username, models) VALUES (?, ?)',
                (username, data)
            )
            await self.conn.commit()
            LOGGER.info(f"Created entry for {username} with models.")
            return True

    async def get_chat_ins_template_list(self, username: str) -> str:
        '''
        根据指定的用户名获取 chat_ins_template_list 的值
        '''
        cursor = await self.conn.execute(
            f'SELECT chat_ins_template_list FROM {self.sheet} WHERE username = ?', (username,)
        )
        row = await cursor.fetchone()
        if row:
            LOGGER.info(f"Retrieved chat_ins_template_list for {username}.")
            return row[0]
        LOGGER.warning(f"chat_ins_template_list for {username} not found.")
        return ""

    async def set_chat_ins_template_list(self, username: str, data: str) -> bool:
        '''
        根据指定的用户名设置 chat_ins_template_list 的值
        '''
        cursor = await self.conn.execute(
            f'SELECT id FROM {self.sheet} WHERE username = ?', (username,)
        )
        row = await cursor.fetchone()
        if row:
            await self.conn.execute(
                f'UPDATE {self.sheet} SET chat_ins_template_list = ? WHERE username = ?',
                (data, username)
            )
            await self.conn.commit()
            LOGGER.info(f"Updated chat_ins_template_list for {username}.")
            return True
        else:
            await self.conn.execute(
                f'INSERT INTO {self.sheet} (username, chat_ins_template_list) VALUES (?, ?)',
                (username, data)
            )
            await self.conn.commit()
            LOGGER.info(f"Created entry for {username} with chat_ins_template_list.")
            return True

    async def get_app_theme(self, username: str) -> str:
        '''
        根据指定的用户名获取 app_theme 的值
        '''
        cursor = await self.conn.execute(
            f'SELECT app_theme FROM {self.sheet} WHERE username = ?', (username,)
        )
        row = await cursor.fetchone()
        if row:
            LOGGER.info(f"Retrieved app_theme for {username}.")
            return row[0]
        LOGGER.warning(f"app_theme for {username} not found.")
        return ""

    async def set_app_theme(self, username: str, data: str) -> bool:
        '''
        根据指定的用户名设置 app_theme 的值
        '''
        cursor = await self.conn.execute(
            f'SELECT id FROM {self.sheet} WHERE username = ?', (username,)
        )
        row = await cursor.fetchone()
        if row:
            await self.conn.execute(
                f'UPDATE {self.sheet} SET app_theme = ? WHERE username = ?',
                (data, username)
            )
            await self.conn.commit()
            LOGGER.info(f"Updated app_theme for {username}.")
            return True
        else:
            await self.conn.execute(
                f'INSERT INTO {self.sheet} (username, app_theme) VALUES (?, ?)',
                (username, data)
            )
            await self.conn.commit()
            LOGGER.info(f"Created entry for {username} with app_theme.")
            return True

    async def get_app_network(self, username: str) -> str:
        '''
        根据指定的用户名获取 app_network 的值
        '''
        cursor = await self.conn.execute(
            f'SELECT app_network FROM {self.sheet} WHERE username = ?', (username,)
        )
        row = await cursor.fetchone()
        if row:
            LOGGER.info(f"Retrieved app_network for {username}.")
            return row[0]
        LOGGER.warning(f"app_network for {username} not found.")
        return ""

    async def set_app_network(self, username: str, data: str) -> bool:
        '''
        根据指定的用户名设置 app_network 的值
        '''
        cursor = await self.conn.execute(
            f'SELECT id FROM {self.sheet} WHERE username = ?', (username,)
        )
        row = await cursor.fetchone()
        if row:
            await self.conn.execute(
                f'UPDATE {self.sheet} SET app_network = ? WHERE username = ?',
                (data, username)
            )
            await self.conn.commit()
            LOGGER.info(f"Updated app_network for {username}.")
            return True
        else:
            await self.conn.execute(
                f'INSERT INTO {self.sheet} (username, app_network) VALUES (?, ?)',
                (username, data)
            )
            await self.conn.commit()
            LOGGER.info(f"Created entry for {username} with app_network.")
            return True
