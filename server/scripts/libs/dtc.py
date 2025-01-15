import json


def dict2Str(dictObj: dict) -> tuple:
    '''Ensure the dict data to be string, It has two return data.
    If it falied, it will return "" and False.
     - (dict) dictObj: The dict data from socket.
    '''
    flag = False
    try:
        rea = json.dumps(dictObj)
        flag = True
    except Exception as eMsg:
        raise ValueError(f"[ERROR] - dict2Str: {eMsg}")
    return rea, flag


def str2Dict(strObj: str) -> dict:
    '''Ensure the string data to be dict,.It has two return data. If it falied, it will return "" and False.
     - (string) strObj: The string data from web.
    '''
    rea = None
    if strObj != None:
        strObj = str(strObj)
        try:
            rea = json.loads(strObj)
        except Exception as eMsg:
            raise ValueError(f"[ERROR] - str2Dict', {eMsg}")
    return rea
