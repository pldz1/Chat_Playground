import base64
import json


def xorEncryptDecrypt(data, key):
    # 确保key长度足够长，若不够则重复填充
    key = (key * ((len(data) // len(key)) + 1))[:len(data)]

    # 将数据和key进行异或操作
    result = bytes([a ^ b for a, b in zip(data, key.encode('utf-8'))])
    return result


def encryptDict(data, key, layers=5):
    # 将字典转换为JSON字符串
    json_str = json.dumps(data)

    # 对JSON字符串进行异或加密
    encrypted_bytes = xorEncryptDecrypt(json_str.encode('utf-8'), key)

    # 嵌套五层Base64编码
    for _ in range(layers):
        encrypted_bytes = base64.urlsafe_b64encode(encrypted_bytes)

    encrypted_str = encrypted_bytes.decode('utf-8')
    return encrypted_str


def decryptDict(encrypted_str, key, layers=5):
    # 嵌套五层Base64解码
    encrypted_bytes = encrypted_str.encode('utf-8')
    for _ in range(layers):
        # 在这里确保进行解码前进行填充处理
        encrypted_bytes = base64.urlsafe_b64decode(
            addPadding(encrypted_bytes.decode('utf-8')))

    # 对字节数据进行异或解密
    decrypted_bytes = xorEncryptDecrypt(encrypted_bytes, key)

    # 将解密后的字节数据转换回JSON字符串
    decrypted_str = decrypted_bytes.decode('utf-8')

    # 将JSON字符串转换回字典
    data = json.loads(decrypted_str)

    return data


def addPadding(data):
    return data + '=' * (-len(data) % 4)
