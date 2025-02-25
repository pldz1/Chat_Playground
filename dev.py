import threading
import subprocess
import os
import time


def run_npm_dev():
    os.chdir('web')
    print("Entering 'web' directory...")
    npm_process = subprocess.Popen(
        ['npm', 'run', 'dev'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    print("npm run dev started.")
    return npm_process


def run_python_script():
    os.chdir('..')
    print("Returning to parent directory...")
    python_process = subprocess.Popen(
        ['python3', '-u', 'server/dev.py'],  # 使用 -u 参数确保不缓冲输出
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    print("python3 server/dev.py started.")
    return python_process


def stream_output(process, name):
    for line in process.stdout:
        print(f"[{name}] {line}", end='')
    for line in process.stderr:
        print(f"[{name} ERROR] {line}", end='')


def main():
    npm_process = run_npm_dev()
    time.sleep(3)  # 等待 npm 服务启动
    python_process = run_python_script()

    # 分别为两个进程创建线程来读取输出
    npm_thread = threading.Thread(target=stream_output, args=(
        npm_process, "npm run dev"), daemon=True)
    python_thread = threading.Thread(target=stream_output, args=(
        python_process, "python3 server/dev.py"), daemon=True)

    npm_thread.start()
    python_thread.start()

    # 主线程等待子进程结束
    npm_process.wait()
    python_process.wait()


if __name__ == "__main__":
    main()
