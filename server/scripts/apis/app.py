import fastapi

from scripts.typedefs import T_Login_Request, T_Login_Response
from scripts.database import USER_DATABASE

APP_ROUTE = fastapi.APIRouter()


@APP_ROUTE.post('/api/v1/login')
async def login(data: T_Login_Request):
    '''
    简单的登录逻辑
    '''
    res = T_Login_Response()
    res.flag = await USER_DATABASE.login(data.username, data.password)

    if res.flag:
        res.log = "Login successfully."
    
    return res
    
