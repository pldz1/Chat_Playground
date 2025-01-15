'''
### 生成随机字符串的方法

 - 因为用到的随机字符串长度比较短(length = 25)也就不用uuid和ulid这些库

 - 加入时间戳,确保生成的随机字符串的唯一性
'''
import base64
import time
import random
import string


def oruuid(length=25):
    '''获取当前时间戳并转换成 Base64 编码'''
    timeStampBytes = str(int(time.time() * 1000)).encode('ascii')
    timeStampEncoded = base64.urlsafe_b64encode(
        timeStampBytes).decode('ascii').rstrip('=')

    # 生成随机部分
    randomPart = ''.join(random.choices(
        string.ascii_letters + string.digits, k=length - len(timeStampEncoded)))

    # 将时间戳和随机部分连接起来
    return timeStampEncoded + '_' + randomPart


def reuuid(length=20):
    '''逆序的uuid'''
    orStr = oruuid(length)
    return orStr[::-1]
