from .config import ProjectConfig
from .logger import Log
from .cuuid import reuuid, oruuid
from .b64 import generate_basic_auth_string

CONF = ProjectConfig()
LOGGER = Log()

__all__ = [
    'CONF',
    "LOGGER",
    'reuuid',
    'oruuid',
    'generate_basic_auth_string'
]
