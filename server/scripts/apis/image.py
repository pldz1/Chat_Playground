
import fastapi
from fastapi.responses import StreamingResponse
from io import BytesIO

from scripts.typedefs import T_Get_Base_A_Request, \
    T_Get_Image_Base_A_Response, \
    T_Push_Image_Request, \
    T_Delete_Image_Request, \
    T_Set_Base_A_Response


from scripts.database import IMAGE_DATABASE

IMAGE_ROUTE = fastapi.APIRouter()


@IMAGE_ROUTE.post('/api/v1/image/getImageList')
async def get_image_list_api(req: T_Get_Base_A_Request):
    """
    获取某个用户的图像列表
    """
    res = T_Get_Image_Base_A_Response()
    try:
        res.data = await IMAGE_DATABASE.get_image_list_by_username(req.username)
        res.flag = True
        res.log = "Successfully."
    except Exception as e:
        res.log = f"Error: {str(e)}"
    return res


@IMAGE_ROUTE.post('/api/v1/image/pushImage')
async def push_image_api(req: T_Push_Image_Request):
    """
    新增图像(下载并存入 SQLite)
    """
    res = T_Set_Base_A_Response()
    try:
        blob = await IMAGE_DATABASE.fetch_image_blob(req.image_url)
        await IMAGE_DATABASE.push_image(
            username=req.username,
            image_id=req.image_id,
            image_prompt=req.image_prompt,
            image_src=blob
        )
        res.flag = True
        res.log = "Successfully."
    except Exception as e:
        res.log = f"Upload Failed: {str(e)}"
    return res


@IMAGE_ROUTE.post('/api/v1/image/deleteImage')
async def delete_image_api(req: T_Delete_Image_Request):
    """
    删除图像(根据 image_id)
    """
    res = T_Set_Base_A_Response()
    try:
        await IMAGE_DATABASE.delete_image(req.image_id)
        res.flag = True
        res.log = "Successfully."
    except Exception as e:
        res.log = f"Delete Failed: {str(e)}"
    return res


@IMAGE_ROUTE.get('/api/v1/image/get/{image_id}')
async def get_image_api(image_id: str):
    """
    获取图像原图内容(根据数据库主键 id)
    返回 StreamingResponse 给前端 <img src=...> 使用
    """
    blob = await IMAGE_DATABASE.get_image_by_id(image_id)
    if not blob:
        return fastapi.responses.JSONResponse(status_code=404, content={"error": "Image not found"})

    return StreamingResponse(BytesIO(blob), media_type="image/*")
