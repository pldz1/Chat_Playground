'''
数据库管理的核心文件
'''
from scripts.libs import CONF
from .chat import ChatSQL
from .user import UserSQL

chatDbPath = CONF.getDateBaseDirectory('chats.db')
userDbPath = CONF.getDateBaseDirectory('users.db')


def getUserSQLHandle() -> UserSQL:
    '''获得一个访问chatSQL的对象'''
    return UserSQL(sqlFileName=userDbPath)


def releaseUserSQLHandle(handle: UserSQL) -> None:
    '''释放UserSQL的资源'''
    handle.releaseCursor()


def getChatSQLHandle() -> ChatSQL:
    '''获得一个访问chatSQL的对象'''
    return ChatSQL(sqlFileName=chatDbPath)


def releaseChatSQLHandle(handle: ChatSQL) -> None:
    '''释放ChatSQL的资源'''
    handle.releaseCursor()
