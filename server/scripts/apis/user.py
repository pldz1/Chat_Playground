import fastapi

from scripts.typedefs import T_Set_Base_A_Response, \
                             T_Get_Base_A_Response, \
                             T_Get_Base_A_Request, \
                             T_Set_Base_A_Request

from scripts.database import USER_DATABASE

USER_ROUTE = fastapi.APIRouter()

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
