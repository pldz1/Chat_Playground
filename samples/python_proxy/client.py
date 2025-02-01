import httpx
import asyncio
from openai import AzureOpenAI

proxy_url = ""
azure_endpoint = "http://127.0.0.1:8000/defm"
api_key = "xxxxxxxxxxxxxxxxxxxxxxxx"
chat_deployment = "gpt-4o-mini"
image_deployment = "dalle3"

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
    deployment = chat_deployment
    api_version = "2024-05-01-preview"
    http_client = use_proxy()
    client = AzureOpenAI(azure_endpoint=azure_endpoint, api_key=api_key, api_version=api_version, http_client=http_client)

    # 请求
    results = client.chat.completions.create(model=deployment, messages=[{"role": "user", "content": [{"type": "text", "text": "Hello?"}]}],timeout=60000)
    print(results.choices[0].message.content)


'''
# ===== 流式的对话测试 =====
'''
async def stream_chat():
    deployment = chat_deployment
    api_version = "2024-05-01-preview"
    http_client = use_proxy()
    client = AzureOpenAI(azure_endpoint=azure_endpoint, api_key=api_key, api_version=api_version, http_client=http_client)

    # 请求
    results = client.chat.completions.create(model=deployment, messages=[{"role": "user", "content": [{"type": "text", "text": "写一个python和java的冒泡算法，并比较不同?"}]}], stream=True, timeout=60000)

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
    deployment = image_deployment
    api_version = "2024-05-01-preview"
    http_client = use_proxy()
    client = AzureOpenAI(azure_endpoint=azure_endpoint, api_key=api_key, api_version=api_version, http_client=http_client)

    # 请求
    results = client.images.generate(model=deployment, prompt="cute cat", timeout=60000)
    print(results.data[0].url)



if __name__ == "__main__":
    asyncio.run(no_stream_chat())
    asyncio.run(stream_chat())
    asyncio.run(gen_dell3_pic())
