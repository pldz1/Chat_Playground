import subprocess
import os
import time
import sys


def run_python_script():
    # 返回上一级目录并执行 python3 main.py
    try:
        print("Returning to parent directory...")
        
        # 执行 python3 main.py，并实时输出
        python_process = subprocess.Popen(
            ['python3', 'server/deploy.py'],
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
    python_process = run_python_script()
    
    # 实时捕获并输出两个进程的输出
    try:
        stream_output(python_process, "python3 main.py")  # 输出 Python 进程内容
        
        # 等待两个进程结束（可选择性地根据需求修改）
        python_process.wait()
    except KeyboardInterrupt:
        print("Process interrupted. Terminating...")
        python_process.terminate()
        
if __name__ == "__main__":
    main()
