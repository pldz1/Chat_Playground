export const UserState = {
  /**
   * 当前的用户名称
   * @type {string}
   */
  username: "",

  /**
   * 当前的用户客户端id
   * @type {string}
   */
  uid: "",

  /**
   * 当前的用户头像 base64 的图像
   * @type {string}
   */
  avatar: "",

  /**
   * 简单的base64加密的认证字符
   * @type {string}
   */
  basicAuth: "",

  /**
   * 是否处于登录状态
   * @type {boolean}
   */
  isLoggedIn: false,

  /**
   * 能使用的对话模型全部列表
   */
  chatModels: [],

  /**
   * 显示设置用户信息的弹框
   * @type {boolean}
   */
  isShowUserSettings: false,

  /**
   * 当前用户的默认的对话参数
   * @type {object}
   */
  userDefaultChatParams: {
    chatName: "",
    modelType: "",
    modelName: "",
    maxTokens: 0,
    prompts: [
      {
        role: "system",
        content: "You are GPT-4o a large language model of OpenAI.",
      },
    ],
    tokens: 0,
    passedMsgLen: 20,
    maxResponseTokens: 2000,
    temperature: 0.7,
    topP: 0.95,
    frequecyPenaty: 0,
    presentPenaty: 0,
    stopSequence: [],
    timeout: 10,
  },

  /**
   * 当前用户的默认的系统设置的参数
   * @type {object}
   */

  userDefaultSettings: {
    isUseProxy: false,
    proxyURL: "",
    wenMarkDownRenderChars: 5,
  },

  /**
   * 设置用户名
   * @param {string} data - name。
   */
  setUserName(data) {
    this.username = data;
  },

  /**
   * 设置base64认证的值
   * @param {string} data - 密文。
   */
  setBasicAuth(data) {
    this.basicAuth = data;
  },

  /**
   * 设置当前登录的状态
   * @param {boolean} data - 状态
   */
  setIsLoggedIn(data) {
    this.isLoggedIn = data;
  },

  /**
   * 设置对话模型
   * @param {Array} data - 状态
   */
  setChatModels(data) {
    this.chatModels = data;
  },

  setUid(data) {
    this.uid = data;
  },

  /**
   * 设置是不是要显示用户设置的弹框
   * @param {boolean} data;
   */
  setShowUserSettings(data) {
    this.isShowUserSettings = data;
  },

  /**
   * 重置当前用户的默认的对话的参数信息
   * @param {object} data - 要更新的数据
   */
  resetUserDefaultChatParams(data) {
    // 循环键值对赋值,更新对话的参数
    Object.keys(data).forEach((key) => {
      this.userDefaultChatParams[key] = data[key];
    });
  },

  /**
   * 重置当前用户的默认的系统设置的信息
   * @param {object} data - 要更新的数据
   */
  resetUserDefaultSettings(data) {
    // 循环键值对赋值,更新对话的参数
    Object.keys(data).forEach((key) => {
      this.userDefaultSettings[key] = data[key];
    });
  },
};
