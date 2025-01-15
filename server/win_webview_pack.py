'''
在 windows 的平台 用pywebview来运行这个fastapi挂起的静态资源网页, 模仿成一个最简单的EXE程序
'''

import os
import ctypes
import webview
import threading

from scripts.libs import CONF, LOGGER
from scripts.apis.core import runWithStatics


def setConsoleMode():
    '''在控制台长时间运行程序, 因为有log的不断输出, 可能造成CMD窗口的挂起, 导致必须回车之后才能继续服务
     解决的办法是通过 [禁用 CMD窗口的 快速编辑模式和插入模式](https://blog.csdn.net/weixin_39858881/article/details/106935616)
    '''
    # 禁用当前CMD窗口的网络代理, 代理可能会影响当前窗口的本地连接
    os.system('set http_proxy=')
    os.system('set https_proxy=')

    # 获取标准输入的句柄
    STD_INPUT_HANDLE = -10
    kernel32 = ctypes.windll.kernel32
    hStdin = kernel32.GetStdHandle(STD_INPUT_HANDLE)

    # 获取当前控制台模式
    mode = ctypes.c_ulong()
    kernel32.GetConsoleMode(hStdin, ctypes.byref(mode))

    # 取消快速编辑模式和插入模式
    # 快速编辑模式: 0x0040 (ENABLE_QUICK_EDIT_MODE)
    # 插入模式: 0x0020 (ENABLE_INSERT_MODE)
    new_mode = mode.value & ~0x0040 & ~0x0020

    # 设置新的控制台模式
    kernel32.SetConsoleMode(hStdin, new_mode)

    LOGGER.info("QUICK_EDIT_MODE and INSERT_MODE are disable!")


def startPywebview():
    webview.create_window('', f"http://{CONF.host}:{CONF.port}")
    webview.start()


if __name__ == "__main__":
    setConsoleMode()
    fastapiThread = threading.Thread(target=runWithStatics,)
    fastapiThread.start()
    startPywebview()
