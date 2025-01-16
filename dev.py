import subprocess
import os
import time
import sys

def run_npm_serve():
    # 进入 web 文件夹并执行 npm run serve
    try:
        os.chdir('web')  # 进入 web 文件夹
        print("Entering 'web' directory...")
        
        # 启动 npm run serve 并保持进程在后台运行，实时输出
        npm_process = subprocess.Popen(
            ['npm', 'run', 'serve'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        print("npm run serve started. Keeping it alive...")
        
        return npm_process
    except Exception as e:
        print(f"Error starting npm process: {e}")
        sys.exit(1)

def run_python_script():
    # 返回上一级目录并执行 python3 main.py
    try:
        os.chdir('..')  # 返回上一级目录
        print("Returning to parent directory...")
        
        # 执行 python3 main.py，并实时输出
        python_process = subprocess.Popen(
            ['python3', 'server/main.py'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print("python3 main.py started.")
        
        return python_process
    except Exception as e:
        print(f"Error running python script: {e}")
        sys.exit(1)

def stream_output(process, name):
    """实时打印进程输出"""
    for line in process.stdout:
        print(f"[{name}] {line}", end='')  # 打印标准输出
    for line in process.stderr:
        print(f"[{name} ERROR] {line}", end='')  # 打印错误输出

def main():
    # 执行操作
    npm_process = run_npm_serve()  # 启动 npm serve
    time.sleep(3)  # 等待一些时间确保 npm 服务已启动
    python_process = run_python_script()  # 执行 python3 main.py
    
    # 实时捕获并输出两个进程的输出
    try:
        stream_output(npm_process, "npm run serve")  # 输出 npm 进程内容
        stream_output(python_process, "python3 server/main.py")  # 输出 Python 进程内容
        
        # 等待两个进程结束（可选择性地根据需求修改）
        npm_process.wait()
        python_process.wait()
    except KeyboardInterrupt:
        print("Process interrupted. Terminating...")
        npm_process.terminate()
        python_process.terminate()
        
if __name__ == "__main__":
    main()
