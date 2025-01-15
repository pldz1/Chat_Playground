'''
用户管理对外的接口
因为本身用户管理的类也就是静态类 这里的api类也可以是静态的暂时不影响设计
接口主要做些异步的内容的操作
'''
import json
from typing import Tuple
from .core import OnlineUserHandles, UserManage, SessionParams
from scripts.libs.arsm import LoginAndLogoutResponse


class UmmAPI:
    @classmethod
    async def initUserSettings(cls, userHandler: OnlineUserHandles) -> None:
        '''登录的用户 初始化一下默认的配置参数'''
        tmpCsStr = userHandler.userSql.getChatSettingsForSpecUser(userHandler.userName)
        if tmpCsStr != None:
            # 已经存在就更新
            tmpCsDict: dict = json.loads(tmpCsStr)
            await userHandler.chat.setChatDefaultParams(tmpCsDict)
        else:
            # 不存在需要新设置
            tmpCsDict: dict = await userHandler.chat.getChatDefaultParams()
            tmpCsStr = json.dumps(tmpCsDict)
            userHandler.userSql.setChatSettingsForSpecUser(userHandler.userName, tmpCsStr)

        # 对于其他设置也是一样的
        tmpCsStr = userHandler.userSql.getProxySettingsForSpecUser(userHandler.userName)
        if tmpCsStr != None:
            # 已经存在就更新
            tmpCsDict: dict = json.loads(tmpCsStr)
            userHandler.httpxp.setHttpxClient(tmpCsDict)
            await userHandler.chat.updateHttpx(userHandler.httpxp)
        else:
            # 不存在需要新设置
            tmpCsDict: dict = await userHandler.httpxp.getHttpxInfo()
            tmpCsStr = json.dumps(tmpCsDict)
            userHandler.userSql.setProxySettingsForSpecUser(userHandler.userName, tmpCsStr)

    @classmethod
    async def loginAPI(cls, userName) -> Tuple[LoginAndLogoutResponse, SessionParams]:
        '''登录成功的操作 也就是开辟各种handler'''
        response = LoginAndLogoutResponse()
        user = UserManage.isUserOnline(userName)

        if user:
            response.log = 'The user is already online. Login success!'
            response.flag = True
        else:
            user = UserManage.addOnlineUser(userName)
            await cls.initUserSettings(user)
            response.log = "Add new user into SERVER. Login success!"
            response.flag = True

        response.uid = user.uid
        response.userName = user.userName
        return response, user.session

    @classmethod
    async def getUserChatDefParamsAPI(cls, userName) -> dict:
        '''获得用户默认的对话参数'''
        userHandler = UserManage.getUserHandle(userName)
        rea = await userHandler.chat.getChatDefaultParams()
        return rea

    @classmethod
    async def setUserChatDefParamsAPI(cls, userName, data) -> bool:
        '''修改掉这个用户的对话handle的默认参数'''
        userHandler = UserManage.getUserHandle(userName)
        userHandler.userSql.setChatSettingsForSpecUser(userName, json.dumps(data))
        await userHandler.chat.setChatDefaultParams(data)
        return True

    @classmethod
    async def getUserSettingsAPI(cls, userName) -> dict:
        '''获得用户的默认设置参数, 目前只有代理的信息'''
        userHandler = UserManage.getUserHandle(userName)
        rea = await userHandler.httpxp.getHttpxInfo()
        return rea

    @classmethod
    async def setUserSettingsAPI(cls, userName, data) -> bool:
        '''修改用户的默认参数, 目前只有代理的信息'''
        userHandler = UserManage.getUserHandle(userName)
        userHandler.httpxp.setHttpxClient(data)
        userHandler.userSql.setProxySettingsForSpecUser(userName, json.dumps(data))
        await userHandler.chat.updateHttpx(userHandler.httpxp)
        return True

    @classmethod
    async def deleteAllChatAPI(cls, userName) -> bool:
        '''修改用户的默认参数, 目前只有代理的信息'''
        userHandler = UserManage.getUserHandle(userName)
        chatCidList = userHandler.userSql.getAllChatHistory(userName)
        print("?????::::", chatCidList)
        for chatCidTuple in chatCidList:
            userHandler.userSql.deleteChatInfoForSpecUser(userName, chatCidTuple[0])
            userHandler.chatSql.deleteSpecTable(userName, chatCidTuple[0])
        return True
