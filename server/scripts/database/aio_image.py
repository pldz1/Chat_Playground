import aiosqlite
import aiohttp
import functools
from typing import Optional, List, Dict, Union
from io import BytesIO

from scripts.libs import LOGGER, CONF


def require_connection(func):
    """
    装饰器：确保数据库连接已建立
    在执行方法前检查 self.conn 是否为 None, 若为空则记录警告并抛出异常
    """
    @functools.wraps(func)
    async def wrapper(self, *args, **kwargs):
        if self.conn is None:
            LOGGER.warning(
                f"Connection is None. Skipping execution of '{func.__name__}'.")
            raise ConnectionError(
                f"Connection is None. Skipping execution of '{func.__name__}'.")
        return await func(self, *args, **kwargs)
    return wrapper


class AIO_Image_Database:
    """
    异步图像数据库操作类, 支持保存、删除、查询图像(含原始 BLOB 数据)
    使用 aiosqlite 异步操作 SQLite 数据库
    """

    def __init__(self) -> None:
        # 数据库连接对象
        self.conn: Optional[aiosqlite.Connection] = None
        # 数据库文件路径, 从配置获取
        self.database_name = CONF.get_database_path('image.db')
        # 表名(存储图像数据)
        self.image_list_sheet = "image_list_sheet"

    async def initialize(self):
        """
        初始化数据库连接, 并创建图像表(如不存在)
        表字段说明：
            - id: 主键, 自增
            - username: 用户名
            - image_id: 图像唯一 ID(逻辑主键)
            - image_prompt: 生成该图像的提示词
            - image_src: 原始图像数据(BLOB 类型)
        """
        self.conn = await aiosqlite.connect(self.database_name)
        if self.conn is None:
            LOGGER.error("Failed to connect to the database.")
            return

        await self.conn.execute(f'''
            CREATE TABLE IF NOT EXISTS {self.image_list_sheet} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                image_id TEXT UNIQUE,
                image_prompt TEXT,
                image_src BLOB
            )
        ''')
        await self.conn.commit()
        LOGGER.info("Successfully initialized the image database!")

    @require_connection
    async def destroy(self):
        """
        销毁数据库连接
        """
        await self.conn.close()
        LOGGER.info("Closed the image database connection.")

    async def fetch_image_blob(self, url: str) -> bytes:
        """
        异步下载远程图片并返回原始 BLOB 数据(bytes)
        """
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as resp:
                if resp.status != 200:
                    raise ValueError(f"Failed to fetch image: {resp.status}")
                return await resp.read()

    @require_connection
    async def push_image(self, username: str, image_id: str, image_prompt: str, image_src: Union[bytes, BytesIO]):
        """
        保存图像信息到数据库(如已有相同 image_id, 则自动替换)

        参数:
            username: 用户名
            image_id: 图像唯一标识符
            image_prompt: 生成图像的 prompt 描述
            image_src: 图像二进制内容, 可为 bytes 或 BytesIO 对象
        """
        if isinstance(image_src, BytesIO):
            image_src = image_src.getvalue()

        await self.conn.execute(f'''
            INSERT OR REPLACE INTO {self.image_list_sheet}
            (username, image_id, image_prompt, image_src)
            VALUES (?, ?, ?, ?)
        ''', (username, image_id, image_prompt, image_src))
        await self.conn.commit()
        LOGGER.info(f"Pushed image for user {username}, image_id: {image_id}")

    @require_connection
    async def delete_image(self, image_id: str):
        """
        删除指定 image_id 的图像记录

        参数:
            image_id: 要删除的图像唯一 ID
        """
        await self.conn.execute(f'''
            DELETE FROM {self.image_list_sheet}
            WHERE image_id = ?
        ''', (image_id,))
        await self.conn.commit()
        LOGGER.info(f"Deleted image with id: {image_id}.")

    @require_connection
    async def get_image_list_by_username(self, username: str) -> List[Dict[str, Union[str, int]]]:
        """
        获取指定用户的所有图像元数据(不含 BLOB, 返回访问路径)

        返回格式：
        [
            {
                "id": str,           # 图像主键 ID
                "prompt": str,       # 图像描述
                "src": str           # 用于 <img src=""> 的访问路径
            },
            ...
        ]
        """
        cursor = await self.conn.execute(f'''
            SELECT image_id, image_prompt FROM {self.image_list_sheet}
            WHERE username = ?
        ''', (username,))
        rows = await cursor.fetchall()

        image_list = [
            {
                "id": row[0],
                "prompt": row[1],
                "src": f"/api/v1/image/get/{row[0]}"  # 注意 row[0] 是 id
            } for row in rows
        ]
        return image_list

    @require_connection
    async def get_image_by_id(self, image_id: str) -> Optional[bytes]:
        """
        根据主键 ID 获取原始图像 BLOB 内容(用于接口发送原图)

        参数:
            image_id: 图像主键 ID(数据库中的 image_id)

        返回:
            图像的原始二进制内容, 若找不到返回 None
        """
        cursor = await self.conn.execute(f'''
            SELECT image_src FROM {self.image_list_sheet}
            WHERE image_id = ?
        ''', (image_id,))
        row = await cursor.fetchone()
        return row[0] if row else None


# 实例化对象
IMAGE_DATABASE = AIO_Image_Database()
