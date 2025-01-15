'''
整个项目 管理用户信息的核心
直接用了 静态类来做全局的状态管理和同步
'''

from typing import List, Optional
from dataclasses import dataclass
from scripts.modules.sql import *
from scripts.modules.chat import ChatAPI
from scripts.modules.network import HttpxProxy
from datetime import datetime


@dataclass
class SessionParams:
    ssid: str = ''
    expiredTime: datetime = None
    maxAge: datetime = None


@dataclass
class OnlineUserHandles:
    userName: str = ''
    uid: str = ''
    session: SessionParams = SessionParams()
    chat: ChatAPI = None
    httpxp: HttpxProxy = None
    userSql: UserSQL = None
    chatSql: ChatSQL = None


class UserManage:
    '''管理项目的用户状态'''

    _ONLINELIST: List[OnlineUserHandles] = []

    @classmethod
    def isUserOnline(cls, name) -> Optional[OnlineUserHandles]:
        '''判断用户是不是在线了'''
        for user in cls._ONLINELIST:
            if user.userName == name:
                return user
        return None

    @classmethod
    def addOnlineUser(cls, userName) -> Optional[OnlineUserHandles]:
        '''新建一个用户 并且初始化它内部的元素'''
        user = OnlineUserHandles()
        tmpHp = HttpxProxy()
        tmpUh = getUserSQLHandle()
        tmpCh = getChatSQLHandle()
        # 用userSqlHandler向数据库存入用户信息 同时也把这个数据库操作的句柄作为这个用户的单例
        user.userName = userName
        user.uid = tmpUh.addUserLoginInfo(userName)

        session = SessionParams()
        session.ssid = tmpUh.getSessionByUserName(userName)
        session.expiredTime = tmpUh.getExpiredTimeByUserName(userName)
        session.maxAge = tmpUh.getMaxAgeByUserName(userName)

        user.userSql = tmpUh
        user.chatSql = tmpCh
        user.httpxp = tmpHp
        user.session = session
        user.chat = ChatAPI(userName, tmpUh, tmpCh, tmpHp)

        cls._ONLINELIST.append(user)
        return user

    @classmethod
    def getChatHandle(cls, uid) -> ChatAPI:
        '''根据用户的唯一标识 找到能够操作对话的句柄'''
        for user in cls._ONLINELIST:
            if user.userName == uid:
                return user.chat

    @classmethod
    def getUserHandle(cls, uid) -> OnlineUserHandles:
        '''根据用户的唯一标识 找到能够操作用户全部内容的句柄'''
        for user in cls._ONLINELIST:
            if user.userName == uid:
                return user

    @classmethod
    def getUserBySession(cls, ssid) -> str:
        '''判断session是不是属于在线用户的'''
        if not ssid:
            return None

        for user in cls._ONLINELIST:
            if user.session.ssid == ssid:
                return user.userName

        # 如果 session 不属于在线用户的 先判断是不是有这个session 这里不不考虑是不是过期
        tmpUserSqlHandler = getUserSQLHandle()
        userName = tmpUserSqlHandler.getUserNameBySession(ssid)
        releaseUserSQLHandle(tmpUserSqlHandler)
        return userName
