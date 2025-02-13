/**
 * 提示内容对象
 * @typedef {Object} PromptContent
 * @property {"text"} type - 内容类型，例如 "text"。
 * @property {string} text - 提示的文本内容。
 */

/**
 * 提示信息对象
 * @typedef {Object} Prompt
 * @property {"system" | "user" | "assistant"} role - 角色，例如 "system" 或 "user"。
 * @property {PromptContent[]} content - 提示内容列表。
 */

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
  curChatModel: { name: "", type: "", baseURL: "", endpoint: "", apiKey: "", model: "", deployment: "", apiVersion: "" },

  /**
   * 对话路由列表
   */
  chatList: [],

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
   * 配置聊天模型的设置参数。
   * @property {number} passedMsgLen - 传递的消息长度。
   * @property {Prompt[]} prompts - 提示信息列表。
   * @property {number} max_tokens - 生成的最大 token 数。
   * @property {number} top_p - Nucleus 采样参数（控制高概率 token 的累积概率阈值）。
   * @property {number} temperature - 生成的随机性（较高的值使输出更随机）。
   * @property {number} frequency_penalty - 频率惩罚系数（降低重复使用相同 token 的可能性）。
   * @property {number} presence_penalty - 存在惩罚系数（鼓励使用新 token）。
   * @property {string[]} stop - 生成停止的标志符列表。
   */
  chatModelSettings: {
    passedMsgLen: 10,
    prompts: [
      { role: "system", content: [{ type: "text", text: "As an AI assistant, please make your responses more engaging by including lively emojis." }] },
    ],
    max_tokens: 800,
    top_p: 0.95,
    temperature: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: [],
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
   * 设置当前对话模型的信息
   */
  setCurChatModel(data) {
    this.curChatModel = data;
  },

  /**
   * 设置当前对话模型参数
   */

  setChatModelSettings(data) {
    this.chatModelSettings = data;
  },
};
