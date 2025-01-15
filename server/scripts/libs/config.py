import os
import sys
import time
import json
import configparser
from .bms import APIParams
from .consts import APIServices
from .encrypt import decryptDict
from typing import Dict, List


class CaseSensitiveConfigParser(configparser.ConfigParser):
    '''严格区分大小写的configparser'''

    def optionxform(self, optionstr):
        return optionstr  # 保持原样，不转换为小写


class ProjectConfig:
    '''整个项目的配置文件'''
    DIR_LOOP = 3    # 当前文件相对于项目main.py的层级

    # 项目用到的文件夹结构和实例对象的属性是一样的命名
    PROJECTNESSDIR = {'dataBasePath', 'cachePath'}

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

        # ⭐⭐⭐用户配置项目的默认参数的文件, 下面的都是它的参数, 并且有必须要判断的条件
        self.userConfigFileName: str = 'config.json'
        self.host: str = '127.0.0.1'                    # 项目运行的Host address
        self.port: int = 10088                          # 项目运行的port号
        self.isExeEnv: bool = False                     # 特殊参数是exe打包的程序, 不用登录
        self.dataBasePath: str = '.dbpath'              # 数据库相对项目的路径
        self.cachePath: str = '.cache'                  # 缓存文件夹路径
        self.staticsPath: str = 'statics'               # 静态资源相对项目的路径
        self.apiParamsListFileName = "cfg.json"         # API服务的全部参数配置
        self.isEncryptedApiParamsList: bool = False     # API参数是不是被加密
        self.encryptData: str = ''                      # API的密文, ⭐如果API是被加密的,这个参数必须不为空
        self.apiParamsList: Dict[str, APIParams] = {}   # API的模型列表
        self.isUseProxy: bool = False                   # 默认是否使用代理来连接API
        self.proxyURL: str = ''                         # 默认的代理链接, ⭐如果使用代理时, 这个参数必须不为空

        '''从外部依赖文件导入配置, 先加入用户的设置,这个优先级更高, 然后再加载模型的设置'''
        self.updateUserConfig()
        self.checkProjectNecessaryDirectory()

    def _getProjectAbsPath(self,):
        '''获得项目的入口脚本文件夹的绝对路径'''
        return os.path.dirname(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

    def _updateModelList(self, APIParamsDict: dict):
        '''更新模型列表，确保模型参数一致'''
        for modelName, modelParams in APIParamsDict.items():
            tmpModel = APIParams()
            tmpModel.__dict__.update(modelParams)
            # 增加元素
            self.apiParamsList[modelName] = tmpModel

    def getAbsPath(self, path: str = None, fileName: str = None) -> str:
        '''获取任何项目文件的绝对路径'''
        projectPath = self._getProjectAbsPath()
        path = path if path is not None else ''
        fileName = fileName if fileName is not None else ''
        return os.path.normpath(os.path.join(projectPath, path, fileName))

    def updateUserConfig(self):
        '''如果有config.json的话, 用config.json更新用户的配置'''
        userConfigFilePath = self.getAbsPath(self.userConfigFileName)

        if not os.path.exists(userConfigFilePath):
            print(f'Not find the user config file ({userConfigFilePath}) !!!')
            # 终结项目
            sys.exit(1)

        # 读取json文件
        with open(userConfigFilePath, 'r') as file:
            userConfigData: dict = json.load(file)

            # 更新值
            for key in userConfigData:
                if key not in list(self.__dict__.keys()):
                    continue
                self.__dict__[key] = userConfigData[key]

        # ⭐ 注意 self.isEncryptedApiParamsList 之后, 必须判断encryptData是不是存在
        if self.isEncryptedApiParamsList:
            if self.encryptData == "":
                print("The project uses an encrypted API model list, but your ciphertext is empty. The project does not have any models!")
                sys.exit(1)
            else:
                # ⭐⭐⭐ 解析加密的 API model List
                self.decryptAPIParamsList()
        else:
            # ⭐⭐⭐ 解析文件存放的json数据的 API model List
            self.loadApiServiceFromCfgFile()

        # 注意 self.isUserProxy之后, self.proxyURL不能为空
        if self.isUseProxy and self.proxyURL == "":
            print("You have configured a proxy, proxy url cannot be empty!")
            exit(1)

    def decryptAPIParamsList(self):
        '''如果配置的是用加密的API model list的情况, 需要解析出结果'''
        try:
            # 解密
            apiCfgData: dict = decryptDict(self.encryptData, 'secretkey')
        except Exception as e:
            print(f'Error tokenKey: {e} ... exit(1)')
            sys.exit(1)

        # 判断是不是过期的tokenKey
        if apiCfgData.get('expiredTime', 0) <= int(time.time()):
            print('Sorry API model is expired!')
            sys.exit(1)

        # 更新全部的模型信息
        self._updateModelList(apiCfgData.get("modelList", {}))

    def loadApiServiceFromCfgFile(self):
        '''从cfg.json中加载API的服务信息'''
        apiCfgFile = self.getAbsPath(self.apiParamsListFileName)

        if not os.path.exists(apiCfgFile):
            print(f'Not find the api config ({apiCfgFile}) !!!')
            # 终结项目
            sys.exit(1)

        # 读取json文件
        with open(apiCfgFile, 'r') as file:
            apiCfgData: dict = json.load(file)

        # 直接赋值就行了, 也不用做时效判断
        self._updateModelList(apiCfgData.get("modelList", {}))

    def checkProjectNecessaryDirectory(self):
        '''判断项目必要的文件目录是不是存在'''
        for key in ProjectConfig.PROJECTNESSDIR:
            nessDirPath = self.getAbsPath(self.__dict__[key])
            if not os.path.exists(nessDirPath):
                os.mkdir(nessDirPath)

    def getDateBaseDirectory(self, fileName: str = None):
        '''获得要用到到的数据库文件的位置'''
        return self.getAbsPath(self.dataBasePath, fileName)

    def getStaticsDirectory(self):
        '''获得静态资源的绝对路径'''
        return self.getAbsPath(self.staticsPath)

    def getCacheDirectory(self):
        '''获得缓存的绝对路径'''
        return self.getAbsPath(self.cachePath)
