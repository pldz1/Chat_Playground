import aiosqlite
from typing import Optional

from scripts.libs import LOGGER


class AIO_Users_Sheet:
    def __init__(self, conn: Optional[aiosqlite.Connection] = None) -> None:
        '''
        管理 users 表的信息,主要保存用户登录后的一些特有属性:
        - id: 数据的主键
        - username: 用户名称（唯一）
        - password: 用户密码
        - uid: 用户的客户端身份 id, 登录时生成
        - session_id: 存放登录的 session 信息
        - expired_time: session 的过期时间
        - max_age: 会话的最大存活时间
        '''
        self.sheet = 'users'
        self.conn: Optional[aiosqlite.Connection] = conn

    async def init_sheet(self):
        '''创建 users 表（如果不存在）'''
        await self.conn.execute(f'''
            CREATE TABLE IF NOT EXISTS {self.sheet} (
                id INTEGER PRIMARY KEY,
                username TEXT UNIQUE,
                password TEXT,
                uid TEXT,
                session_id TEXT,
                expired_time TIMESTAMP,
                max_age INTEGER
            )
        ''')
        await self.conn.commit()

    async def add_user(self, username: str, password: str) -> None:
        '''
        添加新用户,其他字段例如 session_id、expired_time、max_age 等保持默认值(NULL)。
        '''
        await self.conn.execute(
            f"INSERT INTO {self.sheet} (username, password) VALUES (?, ?)",
            (username, password)
        )
        await self.conn.commit()
        LOGGER.info(f"User database has added user '{username}' into {self.sheet} sheet.")

    async def check_user_exists(self, username: str, password: str) -> bool:
        '''
        检查指定的 username 和 password 是否匹配某条记录, 存在返回 True, 否则返回 False
        '''
        async with self.conn.execute(
            f"SELECT id FROM {self.sheet} WHERE username = ? AND password = ?",
            (username, password)
        ) as cursor:
            row = await cursor.fetchone()
            exists = row is not None
            LOGGER.info(f"User check for '{username}': {exists}")
            return exists

    async def update_password(self, username: str, new_password: str) -> bool:
        '''
        更新指定 username 的密码, 如果更新成功（至少一条记录受影响）返回 True, 否则返回 False。
        '''
        cursor = await self.conn.execute(
            f"UPDATE {self.sheet} SET password = ? WHERE username = ?",
            (new_password, username)
        )
        await self.conn.commit()
        updated = cursor.rowcount > 0
        LOGGER.info(f"Password update for '{username}': {updated}")
        return updated

    async def update_session_id(self, username: str, new_session_id: str) -> bool:
        '''
        更新指定 username 的 session_id, 如果更新成功返回 True, 否则返回 False。
        '''
        cursor = await self.conn.execute(
            f"UPDATE {self.sheet} SET session_id = ? WHERE username = ?",
            (new_session_id, username)
        )
        await self.conn.commit()
        updated = cursor.rowcount > 0
        LOGGER.info(f"Session id update for '{username}': {updated}")
        return updated
