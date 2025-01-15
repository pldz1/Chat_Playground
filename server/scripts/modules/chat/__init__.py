'''
实现和OpenAI GPT进行对话的核心模块
'''
from .core import ChatHandle
from .apis import ChatAPI
__all__ = [
    'ChatHandle',
    'ChatAPI'
]
