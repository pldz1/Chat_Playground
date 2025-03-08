import threading
import subprocess
import os
import time
import sys

def run_npm_dev():
    # 根据操作系统选择 npm 命令
    npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
    # 使用 os.path.join 构造路径
    web_dir = os.path.join(os.getcwd(), 'web')
    os.chdir(web_dir)
    print("Entering 'web' directory...")
    npm_process = subprocess.Popen(
        [npm_cmd, 'run', 'dev'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        shell=(os.name == 'nt')  # 在 Windows 下可能需要设置 shell=True
    )
    print("npm run dev started.")
    return npm_process

def run_python_script():
    # 返回上级目录
    parent_dir = os.path.join(os.getcwd(), '..')
    os.chdir(parent_dir)
    print("Returning to parent directory...")
    # 使用当前 Python 解释器
    python_cmd = sys.executable
    python_process = subprocess.Popen(
        [python_cmd, '-u', 'server/dev.py'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    print(f"{python_cmd} server/dev.py started.")
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

    # 为两个进程分别创建线程读取输出
    npm_thread = threading.Thread(target=stream_output, args=(npm_process, "npm run dev"), daemon=True)
    python_thread = threading.Thread(target=stream_output, args=(python_process, "python server/dev.py"), daemon=True)

    npm_thread.start()
    python_thread.start()

    # 主线程等待子进程结束
    npm_process.wait()
    python_process.wait()

if __name__ == "__main__":
    main()
