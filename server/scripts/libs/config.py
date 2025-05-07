import os
import json
import configparser


class CaseSensitiveConfigParser(configparser.ConfigParser):
    '''
    严格区分大小写的configparser
    '''

    def optionxform(self, optionstr):
        return optionstr  # 保持原样，不转换为小写


class ProjectConfig:
    '''
    整个项目的配置文件
    '''
    DIR_LOOP = 3    # 当前文件相对于项目main.py的层级

    # 项目用到的文件夹结构和实例对象的属性是一样的命名
    PROJECTNESSDIR = {'_database_path', '_cache_path', '_statics_path', '_bin_path'}

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ProjectConfig, cls).__new__(
                cls, *args, **kwargs)
            cls._instance.__initialized = False
        return cls._instance

    def __init__(self) -> None:
        # 确保是单例
        if self.__initialized:
            return

        self.__initialized = True

        # 项目的一些路径信息
        self._config_file_name: str = 'config.json'     # 配置文件的文件名称
        self._database_path: str = '.database'           # 数据库相对项目的路径
        self._cache_path: str = '.cache'                 # 缓存文件夹路径
        self._statics_path: str = 'statics'              # 静态资源相对项目的路径
        self._bin_path: str = '.bin'                     # 二进制文件的相对路径

        # 用户配置项目的默认参数
        self.host: str = '127.0.0.1'                     # 项目运行的 Host address
        self.port: int = 10088                           # 项目运行的 port 号
        self.username = "admin"                          # 项目的超级管理员名字
        self.password = "admin"                          # 项目的超级管理员密码
        self.chat_models = {}                            # 项目提供的对话模型
        self.image_models = {}                           # 项目提供的图像模型

        # 从外部依赖文件导入配置, 先加入用户的设置(这个优先级更高), 然后再加载模型的设置
        self.update_config()
        self.check_necessary_path()

    def _abs_path(self):
        '''
        获得项目的入口脚本文件夹的绝对路径
        '''
        return os.path.dirname(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

    def get_abs_path(self, path: str = None, fileName: str = None) -> str:
        '''
        获取任何项目文件的绝对路径
        '''
        projectPath = self._abs_path()
        path = path if path is not None else ''
        fileName = fileName if fileName is not None else ''
        return os.path.normpath(os.path.join(projectPath, path, fileName))

    def update_config(self):
        '''
        从配置文件读取 JSON 的信息，然后初始化成对应的参数
        '''
        # 获取配置文件的绝对路径
        config_path = self.get_abs_path(fileName=self._config_file_name)
        if not os.path.exists(config_path):
            # 如果配置文件不存在，则保留默认配置
            return

        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"JSON 配置文件解析失败: {e}")
            return
        except Exception as e:
            print(f"读取配置文件失败: {e}")
            return

        # 如果配置文件中的数据为字典，则将其中的键值对转换成当前对象的属性
        if isinstance(config_data, dict):
            for key, value in config_data.items():
                setattr(self, key, value)

    def check_necessary_path(self):
        '''
        判断项目必要的文件目录是不是存在
        '''
        for key in ProjectConfig.PROJECTNESSDIR:
            nessDirPath = self.get_abs_path(self.__dict__[key])
            if not os.path.exists(nessDirPath):
                os.mkdir(nessDirPath)

    def get_database_path(self, fileName: str = None):
        '''
        获得要用到的数据库文件的位置
        '''
        return self.get_abs_path(self._database_path, fileName)

    def get_statics_path(self):
        '''
        获得静态资源的绝对路径
        '''
        return self.get_abs_path(self._statics_path)

    def get_cache_path(self):
        '''
        获得缓存的绝对路径
        '''
        return self.get_abs_path(self._cache_path)
