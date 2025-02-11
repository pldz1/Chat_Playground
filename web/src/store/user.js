export const UserState = {
  /**
   * 当前的用户名称
   * @type {string}
   */
  username: "",

  /**
   * 当前的用户密码
   * @type {string}
   */
  password: "",

  /**
   * 当前的用户客户端id
   * @type {string}
   */
  uid: "",

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
   * 当前的对话模型信息
   * @property {string} name - 模型名称，默认为 "新增模型"
   * @property {string} type - 模型类型（"OpenAI" 或 "AzureOpenAI"）
   * @property {string} baseURL - OpenAI 专用：API 请求的基础 URL
   * @property {string} endpoint - Azure 专用：Azure OpenAI 的端点地址
   * @property {string} apiKey - API 访问密钥
   * @property {string} model - OpenAI 专用：要使用的 OpenAI 模型名称（如 "gpt-4o"）
   * @property {string} deployment - Azure 专用：Azure OpenAI 部署名称
   * @property {string} apiVersion - Azure 专用：Azure OpenAI 的协议版本
   */
  curChatModel: { name: "新增模型", type: "", baseURL: "", endpoint: "", apiKey: "", model: "", deployment: "", apiVersion: "" },

  /**
   * 设置用户登录后的信息
   */
  setUserLoginInfo(data) {
    this.username = data.username;
    this.password = data.password;
    this.uid = data.uid;
    this.basicAuth = "";
  },

  /**
   * 设置当前登录的状态
   */
  setIsLoggedIn(data) {
    this.isLoggedIn = data;
  },

  /**
   * 设置对话模型
   */
  setChatModels(data) {
    this.chatModels = data;
  },

  /**
   * 设置当前模型的信息
   */
  setCurChatModel(data) {
    this.curChatModel = data;
  },

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
