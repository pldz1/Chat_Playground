import threading
import subprocess
import os
import time
import sys


def stream_reader(pipe, prefix):
    """从管道中逐行读取输出并打印，每行添加指定前缀"""
    for line in iter(pipe.readline, ''):
        if line:
            print(f"{prefix} {line}", end='')
    pipe.close()


def run_npm_dev():
    """启动 npm 开发服务，使用 cwd 参数指定工作目录"""
    npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
    # 假设 web 目录与当前脚本在同一目录下
    base_dir = os.path.dirname(os.path.abspath(__file__))
    web_dir = os.path.join(base_dir, 'web')
    print(f"在目录 {web_dir} 中启动 npm 开发服务...")

    npm_process = subprocess.Popen(
        [npm_cmd, 'run', 'dev'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        shell=(os.name == 'nt'),
        cwd=web_dir  # 指定工作目录，避免使用 os.chdir()
    )
    print("🎉 npm run dev 已启动")
    return npm_process


def run_python_script():
    """启动 Python 脚本服务，使用 cwd 参数指定工作目录"""
    # 假设 server/dev.py 位于当前脚本所在目录下的 server 子目录中
    base_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"在目录 {base_dir} 中启动 Python 脚本 server/dev.py...")

    python_cmd = sys.executable
    python_process = subprocess.Popen(
        [python_cmd, '-u', os.path.join('server', 'dev.py')],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        cwd=base_dir  # 指定工作目录
    )
    print(f"🎉 {python_cmd} server/dev.py 已启动。")
    return python_process


def main():
    # 启动 npm 服务
    npm_process = run_npm_dev()
    # 等待几秒钟以确保 npm 服务有足够时间启动
    time.sleep(3)
    # 启动 Python 脚本
    python_process = run_python_script()

    # 分别为每个子进程的 stdout 和 stderr 启动独立线程
    threads = []
    threads.append(threading.Thread(target=stream_reader, args=(npm_process.stdout, "[npm STDOUT]"), daemon=True))
    threads.append(threading.Thread(target=stream_reader, args=(npm_process.stderr, "[npm STDERR]"), daemon=True))
    threads.append(threading.Thread(target=stream_reader, args=(python_process.stdout, "[python STDOUT]"), daemon=True))
    threads.append(threading.Thread(target=stream_reader, args=(python_process.stderr, "[python STDERR]"), daemon=True))

    for t in threads:
        t.start()

    # 等待子进程结束并打印退出码
    npm_returncode = npm_process.wait()
    python_returncode = python_process.wait()

    print(f"🚪 npm run dev 退出，退出码: {npm_returncode}")
    print(f"🚪 python server/dev.py 退出，退出码: {python_returncode}")


if __name__ == "__main__":
    main()
