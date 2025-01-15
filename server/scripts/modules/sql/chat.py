'''
#### 操作用户用GPT API对话的全部表单

用户创建一个对话 就会生成一张userName_chatCid的表 这个表是唯一的, 表内存放全部对话的消息

对于userName_chatCid的表 管理对话的一些消息属性:
    - id: 数据的主键
    - chatIid: 要表达的意思是对话内的item的id, 一条对话的一个随机的唯一标志
    - message: 具体的消息内容一个chatAPIMessage类型的字典
    - tokens: 这个消息的tokens数量
'''

import sqlite3
from typing import List, Tuple
from scripts.libs import LOGGER


class ChatSQL:
    def __init__(self, sqlFileName='chats.db') -> None:
        # 简单的配置
        self.dbName = sqlFileName
        # 初始时,连接chat.db数据库
        self.conn = sqlite3.connect(self.dbName)
        self.cursor = self.conn.cursor()

    def createTableByUserNameNChatCid(self, userName, chatCid):
        '''根据用户名和唯一的ChatCid属性来创建一个表,
         实际上输入的参数有多余,因为userName和chatCid都是唯一的标志'''
        # 创建聊天表
        self.cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS {userName}_{chatCid} (
                id INTEGER PRIMARY KEY,
                chatIid TEXT,
                message TEXT,
                tokens INTEGER
            )
        ''')
        self.conn.commit()

    def addItemToSpecTable(self, userName, chatCid, chatIid, message, tokens):
        '''根据指定的chat table中(由userName_chatCid组成), 插入一条chat记录'''
        self.cursor.execute(
            f"INSERT INTO {userName}_{chatCid} (chatIid,message,tokens) VALUES (?,?,?)", (chatIid, message, tokens,))
        LOGGER.info(f'Chat item added to {userName}_{chatCid} table.')
        # 提交更改
        self.conn.commit()

    def deleteSpecTable(self, userName, chatCid):
        '''删除指定用户和聊天表'''
        self.cursor.execute(f"DROP TABLE IF EXISTS {userName}_{chatCid}")

        LOGGER.info(f'Chat table: {userName}_{chatCid} has been deleted successfully.')
        # 提交更改并关闭连接
        self.conn.commit()

    def getItemInSpecTable(self, userName, chatCid, chatIid) -> str:
        '''从表中获取对应的chatIid的文本内容'''
        self.cursor.execute(f"SELECT message FROM {userName}_{chatCid} WHERE chatIid = ?", (chatIid,))
        result: List[Tuple[str]] = self.cursor.fetchall()

        if len(result) > 0:
            LOGGER.info(f'Get chat item {chatIid} in {userName}_{chatCid} table.')
            return result[0][0]

        return None

    def deleteItemInSpecTable(self, userName, chatCid, chatIid):
        self.cursor.execute(f"DELETE FROM {userName}_{chatCid} WHERE chatIid = ?", (chatIid,))
        LOGGER.info(f'Delete chat item {chatIid} in {userName}_{chatCid} table.')
        self.conn.commit()

    def getAllItemInSpecTable(self, userName, chatCid):
        '''查询指定用户和聊天表的所有聊天记录'''
        self.cursor.execute(f"SELECT * FROM {userName}_{chatCid}")
        items = self.cursor.fetchall()
        return items

    def getLastNItemsInSpecTable(self, userName, chatCid, n) -> List[Tuple[int, str, str, str, int]]:
        '''查询指定用户和对话名称下的,倒数n个记录'''
        self.cursor.execute(f"SELECT * FROM {userName}_{chatCid} ORDER BY id DESC LIMIT ?", (n,))
        lastNitems = self.cursor.fetchall()
        return lastNitems

    def getItemNextInfoByUserNameNChatAllId(self, userName, chatCid, chatIid):
        '''特别定制化的一个函数,找出表中chatIid对应的id之后的全部的信息,包括 当前的角色信息, 后续的chatIid列表'''
        self.cursor.execute(f"SELECT id FROM {userName}_{chatCid} WHERE chatIid = ?", (chatIid,))
        result = self.cursor.fetchone()

        if not result:
            return None

        startId = result[0]

        # Step 2: Get all chatIid after the obtained id
        self.cursor.execute(
            f"SELECT chatIid FROM {userName}_{chatCid} WHERE id > ?", (startId,))
        rows = self.cursor.fetchall()

        return [row[0] for row in rows]

    def setItemInSpecTable(self, userName, chatCid, chatIid, message, tokens):
        '''根据指定的ID修改对应的chat的内容'''
        self.cursor.execute(
            f"UPDATE {userName}_{chatCid} SET message = ?, tokens = ? WHERE chatIid = ?", (message, tokens, chatIid,))
        self.conn.commit()

    def releaseCursor(self):
        '''释放游标，关闭资源'''
        self.cursor.close()
