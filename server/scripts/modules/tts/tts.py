import os
import httpx
from openai import OpenAI
from scripts.libs import CONF, reuuid


async def generateBAudioFileByHttpx(data, isUseProxy=False, proxyURL='', model='tts-1-hd', voice='nova', format='mp3', speed=1.2) -> str:
    '''@deprecated 直接调用http的请求来获取, 这个被废弃了, 但是最简单, 先用这个'''
    openaiModelDict: dict = CONF.findDictWithKey1Value('openai')
    openaiModelName = next(iter(openaiModelDict.keys()))

    headers = {
        # 注：key 为 OpenKey 创建的令牌
        'Authorization': f"Bearer {openaiModelDict[openaiModelName]['apiKey']}",
        'Content-Type': 'application/json'
    }
    # 替换为实际的 API 端点
    url = f"{openaiModelDict[openaiModelName]['baseUrl']}/audio/speech"
    inputText = data
    query = {
        "model": model,
        "input": inputText,
        "voice": voice,
        "response_format": "mp3",
        "speed": speed,
    }

    if isUseProxy:
        async with httpx.AsyncClient(proxies={
            'http://': proxyURL,
            'https://': proxyURL
        }) as client:
            response = await client.post(url=url, json=query, headers=headers)
    else:
        async with httpx.AsyncClient() as client:
            response = await client.post(url=url, json=query, headers=headers)

    # 保存文件
    filePath = CONF.getCacheDirectory()
    fileName = f"{reuuid(30)}.mp3"
    fileAllName = os.path.join(filePath, fileName)

    with open(fileAllName, "wb") as f:
        f.write(response.content)

    return fileName


async def getStreamAudio(data, isUseProxy=False, proxyURL='', model='tts-1-hd', voice='nova', speed=1.2):
    '''参考: https://platform.openai.com/docs/guides/text-to-speech
             https://stackoverflow.com/questions/77952454/method-in-python-stream-to-file-not-working
    '''
    openaiModelDict: dict = CONF.findDictWithKey1Value('openai')
    openaiModelName = next(iter(openaiModelDict.keys()))

    if openaiModelName == None:
        return

    if proxyURL:
        client = OpenAI(
            base_url=openaiModelDict[openaiModelName]['baseUrl'],
            api_key=openaiModelDict[openaiModelName]['apiKey'],
            http_client=httpx.Client(proxies={
                'http://': proxyURL,
                'https://': proxyURL
            })
        )
    else:
        client = OpenAI(
            base_url=openaiModelDict[openaiModelName]['baseUrl'],
            api_key=openaiModelDict[openaiModelName]['apiKey']
        )

    with client.audio.speech.with_streaming_response.create(
        model=model,
        voice=voice,
        input=data,
        speed=speed
    ) as response:
        for chunk in response:
            yield chunk
