import base64


def generate_basic_auth_string(username: str, password: str) -> str:
    '''
    根据提供的 user_info 字典（包含 'username' 和 'password'）生成一个 Basic Auth 的加密字符串。
    返回的是一个 Base64 编码后的认证字符串。
    '''
    if username and password:
        # 拼接成 "username:password" 的格式
        auth_string = f"{username}:{password}"

        # 对该字符串进行 Base64 编码
        encoded_auth_string = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')

        return encoded_auth_string
    else:
        raise ValueError("Both 'username' and 'password' must be provided in the user_info dictionary.")
