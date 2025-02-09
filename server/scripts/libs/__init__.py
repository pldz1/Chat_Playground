from .config import ProjectConfig
from .logger import Log
from .cuuid import reuuid, oruuid

CONF = ProjectConfig()
LOGGER = Log()

__all__ = [
    'CONF',
    "LOGGER",
    'reuuid',
    'oruuid'
]
