import fastapi
import asyncio
from scripts.libs import CONF
from scripts.libs.dtc import dict2Str
from scripts.modules.umm import authenticateUser, UserManage
from scripts.libs.arqm import *
from scripts.libs.arsm import *

CHAT_ROUTE = fastapi.APIRouter()


# ==================================================
# 📜 getChatModelListAPI 从配置文件拿到这个用户的权限能够用到的全部的对话模型的列表
# ==================================================


@CHAT_ROUTE.get('/api/chat/getChatModelList')
async def getChatModelListAPI(user: str = fastapi.Depends(authenticateUser)):
    '''获得这个用户能够用到的全部对话模型的列表的API'''
    rea = GetChatModelListResponse()
    handle = UserManage.getChatHandle(user)
    rea.data = await handle.getChatModelList()
    rea.flag = True
    return rea

# ==================================================
# 📜 allHistoryAPI 从数据库拿当前用户的全部对话记录
# 一条对话记录包括对话的名称,以及它的唯一的chatCid
# ==================================================


@CHAT_ROUTE.get('/api/chat/allHistory')
async def allHistoryAPI(user: str = fastapi.Depends(authenticateUser)):
    '''获取全部的对话历史记录的API'''
    rea = AllHistoryResponse()
    handle = UserManage.getChatHandle(user)
    rea.data = await handle.getAllChat()
    rea.flag = True
    return rea

# ==================================================
# ➕ addNewChatAPI 根据新的对话名称创建一个对话表
# 对话名称可以重复因为对话表的唯一标识是chatCid
# 直接在数据库创建一张存对话记录的表
# 返回这个新建对话的chatCid
# ⭐⭐ 注意对话名称在设置参数里面 已经设置了 就不要单独传值
# ==================================================


@CHAT_ROUTE.post('/api/chat/addNewChat')
async def addNewChatAPI(user: str = fastapi.Depends(authenticateUser)):
    rea = NewChatResponse()
    handle = UserManage.getChatHandle(user)
    rea.chatCid = await handle.addNewChat()
    rea.flag = True
    return rea


# ==================================================
# 🛠️ setChatNameAPI 修改对话的名称 可以是任意对话
# ==================================================

@CHAT_ROUTE.post('/api/chat/setChatName')
async def setChatNameAPI(item: SetChatNameAPIRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = SetChatNameResponse()
    handle = UserManage.getChatHandle(user)
    rea.flag = await handle.setChatName(item.chatCid, item.chatName)
    return rea


# ==================================================
# 📖 getSpecChatHistoryAPI 从数据库拿当前用户的唯一chatCid的全部对话历史记录
# 根据指定的chatCid来获取具体的内容
# 返回的response会携带下次要发送的消息消耗的tokens数量
# ==================================================


@CHAT_ROUTE.post('/api/chat/getSpecChatHistory')
async def getSpecChatHistoryAPI(item: GetSpecChatHistoryRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = GetSpecChatHistoryResponse()
    handle = UserManage.getChatHandle(user)
    rea.history, rea.tokens, rea.flag, rea.log = await handle.getSpecChatHistory(item.chatCid)
    return rea

# ==================================================
# ❌ deleteChatAPI 删除当前用户的指定chatCid的对话内容
# 根据chatCid直接删除这张对话的表
# ==================================================


@CHAT_ROUTE.post('/api/chat/deleteChat')
async def deleteChatAPI(item: DeleteChatRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = DeleteChatResponse()
    handle = UserManage.getChatHandle(user)
    rea.flag = await handle.deleteChat(item.chatCid)
    return rea

# ==================================================
# ✉️ setUserMsgAPI 向数据库存入用户的提问
# 向chat hanlder里设置最新的用户提示的内容
# 因为整个prompt是被存在数据库的,设置成功之后, Assistant的请求就不需要携带message了
# ==================================================


@CHAT_ROUTE.post('/api/chat/setUserMsg')
async def setUserMsgAPI(item: SetUserMsgRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = SetUserMsgResponse()
    handle = UserManage.getChatHandle(user)
    rea.flag, rea.chatIid, rea.tokens = await handle.setUserMsg(item.msg)
    return rea

# ==================================================
# ✏️ editChatItemAPI 修改数据库里面对应的消息的内容
# 根据指定的chatIid来修改对应的内容
# ==================================================


@CHAT_ROUTE.post('/api/chat/editChatItem')
async def editChatItemAPI(item: EditChatItemRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = EditChatItemResponse()
    handle = UserManage.getChatHandle(user)
    rea.flag = await handle.editChatItemMsgByID(item.chatIid, item.msg)
    return rea

# ==================================================
# 📃 getChatItemAPI 从数据库获得指定的对话元素的值的API
# 根据指定的chatIid来删除对应的元素
# 注意 如果API返回的message是报错的,那么这个chatIid是无效的, 但是不会影响这里的接口
# ==================================================


@CHAT_ROUTE.post('/api/chat/getChatItem')
async def getChatItemAPI(item: GetChatItemRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = GetChatItemResponse()
    handle = UserManage.getChatHandle(user)
    rea.flag, rea.data = await handle.getChatItemByID(item.chatIid)
    return rea

# ==================================================
# ❌ deleteChatItemAPI 从数据库删除指定的对话元素的API
# 根据指定的chatIid来删除对应的元素
# 注意 如果API返回的message是报错的,那么这个chatIid是无效的, 但是不会影响这里的接口
# ==================================================


@CHAT_ROUTE.post('/api/chat/deleteChatItem')
async def deleteChatItemAPI(item: DeleteChatItemRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = DeleteChatItemResponse()
    handle = UserManage.getChatHandle(user)
    rea.flag = await handle.deleteChatItemByID(item.chatIid)
    return rea

# ==================================================
# ⚙️ getChatParams 获取对话的参数信息的API
# 根据对话的唯一标识 chatCid来从数据库获得配置, 如果是无效的chatCid就返回默认值
# ==================================================


@CHAT_ROUTE.post('/api/chat/getChatParams')
async def getChatParamsAPI(item: GetChatParamsRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = GetChatParamsResponse()
    handle = UserManage.getChatHandle(user)
    rea.data = await handle.getChatParams(item.chatCid)
    rea.flag = True
    return rea

# ==================================================
# 🛠️ SetChatParams的请求
# 根据对话的唯一标识 chatCid来对当前的对话的设置进行修改
# 注意这个函数的数据 非常需要前后端的变量名一致
# ==================================================


@CHAT_ROUTE.post('/api/chat/setChatParams')
async def setChatParamsAPI(item: SetChatParamsRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = SetChatParamsResponse()
    handle = UserManage.getChatHandle(user)
    await handle.setChatParams(item.chatCid, item.data)
    rea.flag = True
    return rea

# ==================================================
# ✨ 📡Chat SSE API 的应答体
# 关键点在于用WEB的eventSource来创建SSE是不能携带header信息
# 通过url挂着chatCid来做用户身份判断
# ==================================================


@CHAT_ROUTE.post("/chat/sse/{chatCid}")
async def sseAPI(user: str = fastapi.Depends(authenticateUser)):
    '''
    SSE方式向WEB端发送消息, WEB 通过@microsoft/fetch-event-source 发送SSE请求 就可以携带参数
    对于asyncio.sleep(0)有解释：
        - await asyncio.sleep(0)在Python的异步编程中通常用于“让出控制权”。当你在协程中使用await asyncio.sleep(0)时,你实际上是在告诉事件循环：“我现在没有什么要做的,你可以去处理其他的任务。”

        - 在你的情况中,这些“其他的任务”可能包括处理WebSocket的数据发送。当你调用websocket.send_text(resp)时,你并不是立即发送数据,而是将数据放入一个发送缓冲区,等待事件循环在适当的时候发送它。当你使用await asyncio.sleep(0)时,你给了事件循环一个机会去处理这个发送任务。

        - 但请注意,这只是一个可能的解释,实际效果可能会因为具体情况而有所不同。在某些情况下,使用await asyncio.sleep(0)可能并不会产生预期的效果。比如,如果事件循环有其他更高优先级的任务要处理,那么即使你使用了await asyncio.sleep(0),事件循环也可能选择先处理那些任务。
    '''
    async def sseEventGenerator():
        rea = ChatSSEResponse()
        handle = UserManage.getChatHandle(user)
        try:
            # 开始请求GPT API
            rea.flag = 1
            resp, _ = dict2Str(rea.__dict__)

            # 包装成符合SSE接收的消息的格式
            yield f"data: {resp}\n\n"

            async for (chunk, tokens, chatIid) in handle.chatStreamAPI():
                rea.flag = 2
                rea.data = f'{chunk}'
                rea.tokens = tokens
                rea.chatIid = chatIid
                resp, _ = dict2Str(rea.__dict__)
                # 持续对话中
                yield f"data: {resp}\n\n"
                # ⭐ 必须 await asyncio.sleep
                await asyncio.sleep(0)

            # 对话结束
            rea.flag = 0
            rea.data = ""
            resp, _ = dict2Str(rea.__dict__)
            yield f"data: {resp}\n\n"
        except Exception as eMsg:
            # 异常返回 -1
            rea.flag = -1
            rea.data = str(eMsg)
            resp, _ = dict2Str(rea.__dict__)
            yield f"data: {resp}\n\n"

    return fastapi.responses.StreamingResponse(sseEventGenerator(), media_type="text/event-stream")

# ==================================================
# 🔄 ReGenerateChatItemContent的请求参数信息
# 根据对话内每条消息的唯一标识 chatIid 来删除后面的全部数据然后重新生成
# 不同的角色会影响是不是要删除当前这条消息的记录
# 注意这个函数的数据 非常需要前后端的变量名一致
# ==================================================


@CHAT_ROUTE.post('/api/chat/reGenerateContent')
async def reGenerateContentAPI(item: ReGenerateContentRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = ReGenerateContentResponse()
    handle = UserManage.getChatHandle(user)
    rea.flag, rea.tokens, rea.log = await handle.reGenerateContent(item.chatIid)
    return rea

# ==================================================
# 📥 downloadChatHistory的请求参数信息
# 这个没有啥介绍的, 主要是设计上不给prompts的信息
# ==================================================


@CHAT_ROUTE.post('/api/chat/downloadChatHistory')
async def downloadChatHistoryAPI(item: DownloadChatHistoryRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = DownloadChatHistoryResponse()
    handle = UserManage.getChatHandle(user)
    rea.flag = True
    rea.data = await handle.downloadChatHistory(item.chatCid)
    return rea

# ==================================================
# 📤 uploadChatHistory的请求参数信息
# 这个没有啥介绍的, 使用默认的对话参数创建一个对话,然后返回一个chatCid
# ==================================================


@CHAT_ROUTE.post('/api/chat/uploadChatHistory')
async def uploadChatHistoryAPI(item: UploadChatHistoryRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = UploadChatHistoryResponse()
    handle = UserManage.getChatHandle(user)
    rea.flag = True
    rea.chatCid, rea.history, rea.tokens = await handle.uploadChatHistory(item.data)
    return rea

# ==================================================
# 👻 newGhostChatAPI的请求参数信息
# 使用默认的对话参数创建一个幽灵对话, 然后WEB 设置对话的固定名称,这个都是很随意的
# 幽灵对话其实是没有上下文记忆的对话
# ==================================================


@CHAT_ROUTE.post('/api/chat/newGhostChat')
async def newGhostChatAPI(item: NewGhostChatRequest, user: str = fastapi.Depends(authenticateUser)):
    rea = NewGhostChatResponse()
    handle = UserManage.getChatHandle(user)
    rea.chatCid, rea.chatParams, rea.tokens = await handle.newGhostChat(item.name, item.template)
    rea.flag = True
    return rea

# ==================================================
# 👻 newGhostChatAPI的请求参数信息
# 使用默认的对话参数创建一个幽灵对话, 然后WEB 设置对话的固定名称,这个都是很随意的
# 幽灵对话其实是没有上下文记忆的对话
# ==================================================


@CHAT_ROUTE.post('/api/chat/sync')
async def chatSyncAPI(request: fastapi.requests.Request, user: str = fastapi.Depends(authenticateUser)):
    rea = ChatSyncAPIsAPIResponse()
    handle = UserManage.getChatHandle(user)
    body = await request.json()
    try:
        rea.context, rea.tokens = handle.chatSync(**body)
        rea.flag = True
        rea.log = 'Success'
    except Exception as eMsg:
        rea.flag = False
        rea.log = eMsg
    return rea
