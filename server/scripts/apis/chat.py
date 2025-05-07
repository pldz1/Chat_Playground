import fastapi

from scripts.typedefs import T_Get_Base_A_Request, \
    T_Get_Base_A_Response, \
    T_Set_Base_A_Response, \
    T_Chat_Base_A_Request, \
    T_Chat_Base_B_Request, \
    T_Chat_Base_C_Request, \
    T_Get_Chat_Base_A_Response, \
    T_Chat_Add_Message_Request, \
    T_Chat_Delete_Message_Request


from scripts.database import CHAT_DATABASE

CHAT_ROUTE = fastapi.APIRouter()


@CHAT_ROUTE.post('/api/v1/chat/getChatList')
async def get_chat_list(req: T_Get_Base_A_Request):
    '''
    获取某个用户的 对话模型的数据
    '''
    res = T_Get_Chat_Base_A_Response()
    res.data = await CHAT_DATABASE.get_cids_and_cnames_by_username(req.username)
    res.flag = True
    res.log = "Successfully."
    return res


@CHAT_ROUTE.post('/api/v1/chat/addChat')
async def add_chat(req: T_Chat_Base_A_Request):
    '''
    新增对话
    '''
    res = T_Set_Base_A_Response()
    await CHAT_DATABASE.create_chat_sheet(req.username, req.cid, req.cname)
    res.flag = True
    res.log = "Successfully."
    return res


@CHAT_ROUTE.post('/api/v1/chat/deleteChat')
async def delete_chat(req: T_Chat_Base_B_Request):
    '''
    删除对话
    '''
    res = T_Set_Base_A_Response()
    await CHAT_DATABASE.delete_chat_sheet(req.username, req.cid)
    res.flag = True
    res.log = "Successfully."
    return res


@CHAT_ROUTE.post('/api/v1/chat/renameChat')
async def rename_chat(req: T_Chat_Base_A_Request):
    '''
    重命名对话
    '''
    res = T_Set_Base_A_Response()
    await CHAT_DATABASE.update_cname_by_username_and_cid(req.username, req.cid, req.cname)
    res.flag = True
    res.log = "Successfully."
    return res


@CHAT_ROUTE.post('/api/v1/chat/deleteChat')
async def delete_chat(req: T_Chat_Base_B_Request):
    '''
    获得全部的消息
    '''
    res = T_Set_Base_A_Response()
    await CHAT_DATABASE.delete_chat_sheet(req.username, req.cid)
    res.flag = True
    res.log = "Successfully."
    return res


@CHAT_ROUTE.post('/api/v1/chat/getAllMessage')
async def get_all_message(req: T_Chat_Base_B_Request):
    '''
    获得全部的消息
    '''
    res = T_Get_Chat_Base_A_Response()
    res.data = await CHAT_DATABASE.get_all_messages_by_username_cid(req.username, req.cid)
    res.flag = True
    res.log = "Successfully."
    return res


@CHAT_ROUTE.post('/api/v1/chat/addMessage')
async def get_all_message(req: T_Chat_Add_Message_Request):
    '''
    获得全部的消息
    '''
    res = T_Set_Base_A_Response()
    await CHAT_DATABASE.insert_message(req.username, req.cid, req.mid, req.message)
    res.flag = True
    res.log = "Successfully."
    return res


@CHAT_ROUTE.post('/api/v1/chat/deleteMessage')
async def get_all_message(req: T_Chat_Delete_Message_Request):
    '''
    获得全部的消息
    '''
    res = T_Set_Base_A_Response()
    await CHAT_DATABASE.delete_message(req.username, req.cid, req.mid)
    res.flag = True
    res.log = "Successfully."
    return res


@CHAT_ROUTE.post('/api/v1/chat/getChatSettings')
async def get_chat_settings(req: T_Chat_Base_B_Request):
    '''
    获得全部的消息
    '''
    res = T_Get_Base_A_Response()
    res.data = await CHAT_DATABASE.get_chat_settings_by_username_cid(req.username, req.cid)
    res.flag = True
    res.log = "Successfully."
    return res


@CHAT_ROUTE.post('/api/v1/chat/setChatSettings')
async def set_chat_settings(req: T_Chat_Base_C_Request):
    '''
    获得全部的消息
    '''
    res = T_Set_Base_A_Response()
    await CHAT_DATABASE.set_chat_settings_by_username_cid(req.username, req.cid, req.data)
    res.flag = True
    res.log = "Successfully."
    return res
