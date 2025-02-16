import fastapi

from scripts.typedefs import T_Login_Request, \
                             T_Login_Response, \
                             T_Set_Base_A_Response, \
                             T_Get_Base_A_Response, \
                             T_Get_Base_A_Request, \
                             T_Set_Base_A_Request

from scripts.database import USER_DATABASE

USER_ROUTE = fastapi.APIRouter()

@USER_ROUTE.post('/api/v1/login')
async def login(data: T_Login_Request):
    '''
    简单的登录逻辑
    '''
    res = T_Login_Response()
    res.flag = await USER_DATABASE.login(data.username, data.password)

    if res.flag:
        res.log = "Login successfully."
    
    return res


@USER_ROUTE.post('/api/v1/user/getChatModels')
async def get_user_chatmodels(req:T_Get_Base_A_Request):
    '''
    获取某个用户的 对话模型的数据
    '''
    res = T_Get_Base_A_Response()
    res.data = await USER_DATABASE.get_chat_models(req.username)
    res.flag = True
    res.log = "Successfully."
    return res


@USER_ROUTE.post('/api/v1/user/setChatModels')
async def set_user_chatmodels(req:T_Set_Base_A_Request):
    '''
    获取某个用户的 对话模型的数据
    '''
    res = T_Set_Base_A_Response()
    res.flag = await USER_DATABASE.set_chat_models(req.username, req.data)

    if res.flag == True:
        res.log = "Successfully."
    else:
        res.log = "The database setting user dialogue model operation failed."
    return res

@USER_ROUTE.post('/api/v1/user/getChatInsTemplateList')
async def get_user_chat_ins_template_list(req:T_Get_Base_A_Request):
    '''
    获取某个用户的 对话模型的数据
    '''
    res = T_Get_Base_A_Response()
    res.data = await USER_DATABASE.get_chat_ins_template_list(req.username)
    res.flag = True
    res.log = "Successfully."
    return res


@USER_ROUTE.post('/api/v1/user/setChatInsTemplateList')
async def set_user_chat_ins_template_list(req:T_Set_Base_A_Request):
    '''
    获取某个用户的 对话模型的数据
    '''
    res = T_Set_Base_A_Response()
    res.flag = await USER_DATABASE.set_chat_ins_template_list(req.username, req.data)

    if res.flag == True:
        res.log = "Successfully."
    else:
        res.log = "The database setting user dialogue model operation failed."
    return res
