import subprocess
import os
import time
import sys

def run_npm_install():
    # 进入 web 文件夹并执行 npm install
    try:
        os.chdir('web')  # 进入 web 文件夹
        print(f"Entering 'web' directory...")

        # 启动 npm install
        npm_process = subprocess.Popen(
            ['npm', 'install'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        print("npm install started. Keeping it alive...")

        return npm_process
    except Exception as e:
        print(f"Error starting npm install process: {e}")
        sys.exit(1)


def run_npm_build():
    # 执行 npm run build
    try:
        print("Start to run `npm run build` ... ...")

        # 启动 npm run build
        npm_process = subprocess.Popen(
            ['npm', 'run', 'build'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        print("npm run build started. Keeping it alive...")

        return npm_process
    except Exception as e:
        print(f"Error starting npm build process: {e}")
        sys.exit(1)


def stream_output(process, name):
    """实时打印进程输出"""
    for line in process.stdout:
        print(f"[{name}] {line}", end='')  # 打印标准输出
    for line in process.stderr:
        print(f"[{name} ERROR] {line}", end='')  # 打印错误输出


def main():
    # 执行操作
    npm_install_process = run_npm_install()
    time.sleep(3)  # 等待一些时间确保 npm 安装已经开始
    npm_build_process = run_npm_build()

    # 实时捕获并输出两个进程的输出
    try:
        stream_output(npm_install_process, "npm install")
        stream_output(npm_build_process, "npm run build")

        # 等待两个进程结束
        npm_install_process.wait()
        npm_build_process.wait()

    except KeyboardInterrupt:
        print("Process interrupted. Terminating...")
        npm_install_process.terminate()
        npm_build_process.terminate()


if __name__ == "__main__":
    main()
