import asyncio
from aiohttp import web, ClientSession, WSMsgType
from urllib.parse import urlparse

# 定义真实目标主机（请根据需要修改
DEFM = "defm/"
TARGET = "https://xxxxxxx.com"
APIKEY = "xxxxxxxxxxxxxxxxxx"

# 按照 RFC 要求，需要过滤一些跳过传递的头部
HOP_HEADERS = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
}

async def proxy_handler(request: web.Request) -> web.StreamResponse:
    """
    根据请求类型选择 HTTP 代理或 WebSocket 代理
    """
    if request.headers.get("Upgrade", "").lower() == "websocket":
        return await websocket_handler(request)
    else:
        return await http_handler(request)

async def http_handler(request: web.Request) -> web.StreamResponse:
    """
    处理普通 HTTP 请求（包括 SSE 流）。
    将请求转发给目标服务器，并以流的方式将响应转发给客户端。
    """
    # 构造目标 URL（包括 path 和 query string）
    target_url = TARGET + request.rel_url.raw_path
    if request.rel_url.query_string:
        target_url += "?" + request.rel_url.query_string

    # 防止路径拼接时出现连续的双斜杠
    target_url = target_url.replace("defm/", "")
    # print(target_url)

    # 构造转发时使用的请求头（过滤掉 hop-by-hop 头部）
    headers = {}
    for name, value in request.headers.items():
        if name.lower() not in HOP_HEADERS:
            headers[name] = value

    # 将 Host 头改为目标主机
    parsed_target = urlparse(TARGET)
    headers["Host"] = parsed_target.netloc
    # headers['Authorization'] = f"Bearer {APIKEY}"
    # headers['api-key'] = APIKEY
    # print(headers)

    # 读取客户端请求体（如果有的话）
    body = await request.read()

    async with ClientSession() as session:
        async with session.request(
            request.method,
            target_url,
            headers=headers,
            data=body,
            allow_redirects=False
        ) as resp:
            # 使用 StreamResponse 实现流式转发，适合 SSE 或大文件下载
            proxy_response = web.StreamResponse(status=resp.status, reason=resp.reason)
            # 复制响应头（排除 hop-by-hop 头）
            for name, value in resp.headers.items():
                if name.lower() not in HOP_HEADERS:
                    proxy_response.headers[name] = value
            await proxy_response.prepare(request)
            async for chunk in resp.content.iter_chunked(1024):
                await proxy_response.write(chunk)
            await proxy_response.write_eof()
            return proxy_response

async def websocket_handler(request: web.Request) -> web.WebSocketResponse:
    """
    处理 WebSocket 连接。将客户端和目标服务器之间的数据进行双向转发。
    """
    ws_server = web.WebSocketResponse()
    await ws_server.prepare(request)

    # 将 http(s) 协议转换为 ws(s) 协议
    if TARGET.startswith("https://"):
        ws_target = TARGET.replace("https://", "wss://")
    elif TARGET.startswith("http://"):
        ws_target = TARGET.replace("http://", "ws://")
    else:
        ws_target = TARGET
    ws_target += str(request.rel_url)

    # 防止路径拼接时出现连续的双斜杠
    ws_target = ws_target.replace('//', '/')

    # 如果客户端请求中包含子协议，可以获取并转发
    protocols = request.headers.getall("Sec-WebSocket-Protocol", [])

    async with ClientSession() as session:
        async with session.ws_connect(ws_target, protocols=protocols) as ws_client:
            async def ws_forward(ws_from, ws_to):
                async for msg in ws_from:
                    if msg.type == WSMsgType.TEXT:
                        await ws_to.send_str(msg.data)
                    elif msg.type == WSMsgType.BINARY:
                        await ws_to.send_bytes(msg.data)
                    elif msg.type == WSMsgType.CLOSE:
                        await ws_to.close()
                    elif msg.type == WSMsgType.ERROR:
                        break

            # 使用 asyncio.gather 同时转发双向数据
            await asyncio.gather(
                ws_forward(ws_server, ws_client),
                ws_forward(ws_client, ws_server)
            )
    return ws_server

def main():
    app = web.Application()
    # 捕获所有以 /defm 开头的 URL 路径
    app.router.add_route("*", "/defm/{tail:.*}", proxy_handler)
    web.run_app(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    main()
