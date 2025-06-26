import os
import time
import logging
from logging.handlers import TimedRotatingFileHandler


class Log():
    '''
    The logging handling level int value:
     - CRITICAL = 50
     - FATAL = CRITICAL
     - ERROR = 40
     - WARNING = 30
     - WARN = WARNING
     - INFO = 20
     - DEBUG = 10
     - NOTSET = 0
    '''

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Log, cls).__new__(
                cls, *args, **kwargs)
            cls._instance.__initialized = False
        return cls._instance

    def __init__(self, consoleLevel=20, fileLevel=30, filePath="") -> None:
        '''Initialize the instance of Log.
         - (str) consoleLevel: The console outputs a log level, default value is 10.
         - (str) fileLevelL: The file output log level, the default value is 50.
         - (str) filePath: The log file directory, the default vaule is the current location.
        '''
        # 确保是单例
        if self.__initialized:
            return
        self.__initialized = True

        self.logger = logging.Logger('CHAT_GUI')
        self.logger.setLevel(logging.DEBUG)
        self.formatter = logging.Formatter(
            '[ %(levelname)s ] - CHAT_GUI: %(message)s')
        self.setting_log(consoleLevel, fileLevel, filePath)

    def setting_log(self, consoleLevel, fileLevel, filePath) -> None:
        '''The main function to set the logger handler.
         - (str) consoleLevel: The log level at which the information can be outputed on screen.
         - (str) fileLevel: The log level at which the file can be written.
         - (str) filePath: The log file path, If the path does not exist, one is created.
        '''
        self.set_console_handling(consoleLevel)
        if filePath != "":
            print(filePath)
            self.set_file_handling(fileLevel, filePath)

    def set_console_handling(self, level) -> None:
        '''Set the log level at which the information can be outputed on screen.
         - (str) level: The log level at which the information can be outputed on screen.
        '''
        consoleHandling = logging.StreamHandler()
        # The handle to control if the logger can be output on terminal.
        consoleHandling = logging.StreamHandler()
        # If you want the INFO can be outputed on terminal, you can set the level in DEBUG
        consoleHandling.setLevel(level)
        consoleHandling.setFormatter(self.formatter)

        self.logger.addHandler(consoleHandling)

    def set_file_handling(self, level, filePath) -> None:
        '''Set the log file path and Set the log level at which the file can be written.
         - (str) level: The log level at which the file can be written.
         - (str) filePath: The log file path, If the path does not exist, one is created.
        '''
        # The handle of the files saved.
        logPath = os.getcwd() + filePath + "/"
        if not os.path.exists(logPath):
            try:
                os.mkdir(logPath)
            except OSError:
                print("Create the log file directory `{}`  failed!".format(logPath))
                return

        logName = time.strftime('%Y-%m-%d-%H-%M-%S.log', time.localtime())
        fileHandler = TimedRotatingFileHandler(
            logPath+logName, when='midnight', backupCount=3)
        print(logPath+logName)
        fileHandler.setLevel(level)
        fileHandler.setFormatter(self.formatter)

        self.logger.addHandler(fileHandler)

    def info(self, message) -> None:
        self.logger.info(message)

    def debug(self, message) -> None:
        self.logger.debug(message)

    def warning(self, message) -> None:
        self.logger.warning(message)

    def error(self, message) -> None:
        self.logger.error(message)

    def critical(self, message) -> None:
        self.logger.critical(message)
