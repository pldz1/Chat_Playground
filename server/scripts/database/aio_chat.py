import aiosqlite
import functools
from typing import Optional, List, Dict

from scripts.libs import LOGGER, CONF

def require_connection(func):
    """
    装饰器：在执行被装饰方法之前,判断 self.conn 是否为 None。
    如果是 None,则记录日志并抛出异常，防止方法执行。
    """
    @functools.wraps(func)
    async def wrapper(self, *args, **kwargs):
        if self.conn is None:
            LOGGER.warning(f"Connection is None. Skipping execution of '{func.__name__}'.")
            raise ConnectionError(f"Connection is None. Skipping execution of '{func.__name__}'.")
        return await func(self, *args, **kwargs)
    return wrapper


class AIO_Chat_Database:
    def __init__(self) -> None:
        # 简单的配置
        self.conn: Optional[aiosqlite.Connection] = None
        self.database_name = CONF.get_database_path('chat.db')
        self.cids_sheet_name = "cids"
        

    async def initialize(self):
        '''
        异步初始化,连接数据库并创建总表
        '''
        # 初始时,异步连接数据库
        self.conn = await aiosqlite.connect(self.database_name)
        if self.conn is None:
            LOGGER.error("Failed to connect to the database.")
            return
    
        '''
        管理 chat 内容具体的表, 说白了就是一个用户有哪些对话名字:
        - id: 数据的主键
        - username: 用户名称（唯一）
        - cid: 对话的 id 和 username_cid 组成一个存对话内容的 sheet
        - cname: 对话的名字
        '''
        await self.conn.execute(f'''
            CREATE TABLE IF NOT EXISTS {self.cids_sheet_name} (
                id INTEGER PRIMARY KEY,
                username TEXT,
                cid TEXT,
                cname TEXT,
                settings TEXT
            )
        ''')
        await self.conn.commit()
        LOGGER.info("Successfully initialized the chat database!")

    @require_connection
    async def destroy(self):
        '''
        关闭资源
        '''
        await self.conn.close()
        LOGGER.info("Closed the chat database connection.")

    @require_connection
    async def get_cids_and_cnames_by_username(self, username: str) -> List[Dict[str, str]]:
        '''
        根据指定的 username 查询所有的 cid 和 cname
        如果没有找到任何记录，返回空列表
        '''
        cursor = await self.conn.execute(f'''
            SELECT cid, cname FROM {self.cids_sheet_name} WHERE username = ?
        ''', (username,))
        
        rows = await cursor.fetchall()
        
        # 如果没有数据，返回空列表
        if not rows:
            LOGGER.info(f"No cids and cnames found for username={username}")
            return []
        
        # 如果有数据，返回格式化后的结果
        result = [{'cid': row[0], 'cname': row[1]} for row in rows]
        
        LOGGER.info(f"Retrieved cids and cnames for username={username}.")
        return result

    @require_connection
    async def get_chat_settings_by_username_cid(self, username: str, cid:str) -> str:
        '''
        根据指定的 username 和 cid 查询 settings
        如果没有找到任何记录, 返回字符串
        '''
        cursor = await self.conn.execute(f'''
            SELECT settings FROM {self.cids_sheet_name} WHERE username = ? AND cid = ?
        ''', (username, cid))
        
        data = await cursor.fetchone()
        
        # 如果没有数据，返回空字符串
        if not data:
            LOGGER.info(f"No settings found for username={username} and cid={cid}")
            return ""

        LOGGER.info(f"Retrieved settings for username={username} and cid={cid}.")
        return data
    
    @require_connection
    async def set_chat_settings_by_username_cid(self, username: str, cid: str, settings: str) -> None:
        '''
        更新或插入指定 username 和 cid 的 settings
        '''
        # 先尝试更新
        cursor = await self.conn.execute(f'''
            UPDATE {self.cids_sheet_name}
            SET settings = ?
            WHERE username = ? AND cid = ?
        ''', (settings, username, cid))

        # 如果没有更新任何行，则插入新记录
        if cursor.rowcount == 0:
            await self.conn.execute(f'''
                INSERT INTO {self.cids_sheet_name} (username, cid, settings)
                VALUES (?, ?, ?)
            ''', (username, cid, settings))

        await self.conn.commit()
        LOGGER.info(f"Updated settings for username={username} and cid={cid}.")



    @require_connection
    async def create_chat_sheet(self, username: str, cid: str, cname:str):
        '''
        创建存具体对话的表
        '''

        await self.conn.execute(f'''
            INSERT INTO {self.cids_sheet_name} (username, cid, cname)
            VALUES (?, ?, ?)
        ''', (username, cid, cname))
        await self.conn.commit()

        sheet_name = f"{username}_{cid}"

        '''
        chat 有哪些消息的表:
        - id: 数据的主键
        - mid: 消息的 id, 由前端给到
        - message: JSON.stringify(OBJ)的字符串, 具体的消息内容
        '''
        await self.conn.execute(f'''
            CREATE TABLE IF NOT EXISTS "{sheet_name}" (
                id INTEGER PRIMARY KEY,
                mid TEXT,
                message TEXT
            )
        ''')
        await self.conn.commit()
        LOGGER.info(f"Created chat sheet: {sheet_name}")

    @require_connection
    async def delete_chat_sheet(self, username: str, cid: str):
        '''
        删除指定的 username_cid 的 chat sheet
        '''
        await self.conn.execute(f'''
            DELETE FROM {self.cids_sheet_name} WHERE username = ? AND cid = ?
        ''', (username, cid))
        await self.conn.commit()
        LOGGER.info(f"Deleted user cid info: username={username}, cid={cid}")

        sheet_name = f"{username}_{cid}"
        await self.conn.execute(f'DROP TABLE IF EXISTS "{sheet_name}"')
        await self.conn.commit()
        LOGGER.info(f"Deleted chat sheet: {sheet_name}")

    @require_connection
    async def update_cname_by_username_and_cid(self, username: str, cid: str, new_cname: str):
        '''
        根据指定的 username 和 cid 更新 cids_sheet_name 表中的 cname
        '''
        result = await self.conn.execute(f'''
            UPDATE {self.cids_sheet_name}
            SET cname = ?
            WHERE username = ? AND cid = ?
        ''', (new_cname, username, cid))

        # 检查是否有更新的行
        if result.rowcount == 0:
            LOGGER.warning(f"No record found to update for username={username}, cid={cid}.")
        else:
            LOGGER.info(f"Updated cname for username={username}, cid={cid} to {new_cname}")
        
        await self.conn.commit()


    @require_connection
    async def insert_message(self, username: str, cid: str, mid: str, message: str):
        '''
        在指定的 username_cid 的表中插入一条数据
        '''
        sheet_name = f"{username}_{cid}"
        await self.conn.execute(f'''
            INSERT INTO "{sheet_name}" (mid, message)
            VALUES (?, ?)
        ''', (mid, message))
        await self.conn.commit()
        LOGGER.info(f"Inserted message with mid: {mid} into {sheet_name}")

    @require_connection
    async def delete_message(self, username: str, cid: str, mid: str):
        '''
        根据指定的 mid 删除指定的消息
        '''
        sheet_name = f"{username}_{cid}"
        await self.conn.execute(f'''
            DELETE FROM "{sheet_name}"
            WHERE mid = ?
        ''', (mid,))
        await self.conn.commit()
        LOGGER.info(f"Deleted message with mid: {mid} from {sheet_name}")

    @require_connection
    async def get_all_messages_by_username_cid(self, username: str, cid: str) -> List[Dict[str, str]]:
        '''
        根据指定的 username 和 cid 获取所有的消息
        返回消息列表 [{mid: mid, message: message}, ...]
        '''
        sheet_name = f"{username}_{cid}"
        cursor = await self.conn.execute(f'''
            SELECT mid, message FROM "{sheet_name}"
        ''')

        rows = await cursor.fetchall()

        if not rows:
            LOGGER.info(f"No messages found for username={username}, cid={cid}")
            return []
        
        result = [{'mid': row[0], 'message': row[1]} for row in rows]
        LOGGER.info(f"Retrieved all messages for username={username}.")
        return result


# 实例化对象
CHAT_DATABASE = AIO_Chat_Database()
