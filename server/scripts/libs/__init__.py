from .config import ProjectConfig
from .logger import Log

CONF = ProjectConfig()
LOGGER = Log()

__all__ = [
    'CONF',
    "LOGGER"
]
