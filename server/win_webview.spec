# -*- mode: python ; coding: utf-8 -*-

import sys
from os.path import join, dirname
from os import getcwd

# 获取当前工作目录
current_path = getcwd()  

a = Analysis(
    ['win_webview.py'],
    pathex=[join(sys.prefix, 'Lib', 'site-packages')],
    binaries=[],
    datas=[
        (join(current_path, 'statics'), 'statics'),  # 包含 statics 文件夹
        (join(current_path, 'config.json'), '.'),    # 包含 config.json 文件
    ],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='AIGC_Playground',
    icon=join(current_path, 'statics','favicon.ico'),  # 指定图标文件
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,  # 设置为 False，则运行时不会显示控制台
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)


coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='Chat_Playground_v1',
)
