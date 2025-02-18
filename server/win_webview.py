import os
import json
import ctypes
import webview
import threading
import webbrowser


from scripts.libs import CONF, LOGGER
from scripts.apis.core import run_main


def setConsoleMode():
    '''在控制台长时间运行程序, 因为有 log 的不断输出, 可能造成 CMD 窗口挂起,
       解决办法是禁用 CMD 窗口的快速编辑模式和插入模式
    '''
    # 禁用当前 CMD 窗口的网络代理，代理可能会影响本地连接
    os.system('set http_proxy=')
    os.system('set https_proxy=')

    # 获取标准输入的句柄
    STD_INPUT_HANDLE = -10
    kernel32 = ctypes.windll.kernel32
    hStdin = kernel32.GetStdHandle(STD_INPUT_HANDLE)

    # 获取当前控制台模式
    mode = ctypes.c_ulong()
    kernel32.GetConsoleMode(hStdin, ctypes.byref(mode))

    # 取消快速编辑模式(0x0040)和插入模式(0x0020)
    new_mode = mode.value & ~0x0040 & ~0x0020

    # 设置新的控制台模式
    kernel32.SetConsoleMode(hStdin, new_mode)

    LOGGER.info("QUICK_EDIT_MODE and INSERT_MODE are disable!")


def on_closing(window):
    """
    窗口关闭前的回调函数
    弹出确认对话框，确认后结束进程，否则取消关闭
    """
    response = ctypes.windll.user32.MessageBoxW(
        0, "确定退出吗？", "退出确认", 1
    )
    if response == 1:  # 用户点击了“确定”
        os._exit(0)    # 立即结束所有进程，包括 fastapi 线程
    else:
        # 返回 False 取消窗口关闭
        return False


class API:
    """
    暴露给 JavaScript 的接口，用于打开外部链接
    """

    def open_external(self, url):
        webbrowser.open(url)
        LOGGER.info(f"Using default browser to open: {url}")
        return None


def startPywebview():
    # 创建一个 API 实例，并在创建窗口时传入 js_api 参数
    api = API()
    window = webview.create_window(
        '', f"http://{CONF.host}:{CONF.port}", js_api=api
    )
    window.events.closing += on_closing

    # 当页面加载完成后，注入 JS 代码重写 window.open
    def override_window_open():
        js_code = """
        // 重写 window.open 方法，调用 Python 的 open_external 方法
        window.open = function(url) {
            if (window.pywebview && window.pywebview.api) {
                window.pywebview.api.open_external(url);
            } else {
                console.log('pywebview API not available');
            }
        }
        """
        window.evaluate_js(js_code)
        console_msg = "window.open 已被重写：将使用默认浏览器打开链接"
        LOGGER.info(console_msg)
    window.events.loaded += lambda: override_window_open()

    webview.start()


if __name__ == "__main__":
    setConsoleMode()
    fastapiThread = threading.Thread(target=run_main)
    fastapiThread.start()
    startPywebview()
