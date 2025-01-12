import httpx
import asyncio
from openai import OpenAI

proxy_url = "xxxxxxxxxxxxxxxxxx"
api_key = "xxxxxxxxxxxxxxxxxx"


def use_proxy():
    http_client = None
    if(not proxy_url):
        http_client = httpx.Client()
        return http_client

    http_client = httpx.Client(proxies={'http://': proxy_url, 'https://': proxy_url})
    return http_client



'''
# ===== 非流式的对话测试 =====
'''
async def no_stream_chat():
    http_client = use_proxy()
    client = OpenAI(api_key=api_key,http_client=http_client)

    # 请求
    results = client.chat.completions.create(model= "gpt-4o-mini", messages=[{"role": "user", "content": [{"type": "text", "text": "Hello?"}]}])
    print(results.choices[0].message.content)


'''
# ===== 流式的对话测试 =====
'''
async def stream_chat():
    http_client = use_proxy()
    client = OpenAI(api_key=api_key,http_client=http_client)

    # 请求
    results = client.chat.completions.create(model= "gpt-4o-mini", messages=[{"role": "user", "content": [{"type": "text", "text": "Hello?"}]}], stream=True)

    for chunk in results:
        choice = chunk.choices
        if choice == []:
            continue

        content = choice[0].delta.content
        print(content)

'''
# ===== 生成图像的函数 =====
'''
async def gen_dell3_pic():
    http_client = use_proxy()
    client = OpenAI(api_key=api_key,http_client=http_client)

    # 请求
    results = client.images.generate(model="dall-e-3", prompt="A cute cat")
    print(results.data[0].url)
 


if __name__ == "__main__":
    asyncio.run(no_stream_chat())
    asyncio.run(stream_chat())
    asyncio.run(gen_dell3_pic())