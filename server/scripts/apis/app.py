import fastapi

from scripts.typedefs import T_Login_Request, T_Login_Response

APP_ROUTE = fastapi.APIRouter()


@APP_ROUTE.post('/api/v1/login')
async def loginAPI(data: T_Login_Request):
    '''
    简单的登录逻辑
    '''
    res = T_Login_Response()
    if(data.user != data.password):
        res.flag = False
    else:
        res.flag = True
        res.log = "Login successfully."
        return res
    
