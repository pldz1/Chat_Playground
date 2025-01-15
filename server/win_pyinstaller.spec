# -*- mode: python ; coding: utf-8 -*-


import sys
from os import getcwd
from os.path import dirname, join

current_path = getcwd()  # 获取当前工作目录


a = Analysis(
    ['win_webview_pack.py'],
    pathex=[join(dirname(sys.executable), 'Lib', 'site-packages')],
    binaries=[],
    datas=[
        (join(current_path, 'statics'), 'statics'),  # 包含statics文件夹
        (join(current_path, '.dbpath'), '.dbpath'),  # 包含config.json文件
        (join(current_path, '.cache'), '.cache'),    # 包含config.json文件
        (join(current_path, 'config.json'), '.'),    # 包含config.json文件
    ],
    hiddenimports=[
        'tiktoken_ext.openai_public',
        'tiktoken_ext'
    ],
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
    name='win_webview_pack',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
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
    name='win_webview_pack',
)
