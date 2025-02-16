import { model_T } from "@/typings";

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
   * 全部模型
   * @property {any[]} chat 对话模型列表
   * @property {any[]} image 图像模型列表
   * @property {any[]} rtaduio 实时语音模型列表
   */
  models: { chat: [], image: [], rtaudio: [] },

  /**
   * 当前的对话模型信息
   */
  curChatModel: structuredClone(model_T),

  /**
   * 当前用户有的对话指令
   */
  chatInsTemplateList: [],

  /**
   * 当前的对话id
   */
  curChatId: "",

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
   * 设置全部模型
   */
  setModels(data) {
    this.models = data;
  },

  /**
   * 设置对话指令列表
   */
  setChatInsTemplateList(data) {
    this.chatInsTemplateList = data;
  },

  /**
   * 设置当前对话模型的信息
   */
  setCurChatModel(data) {
    this.curChatModel = data;
  },

  /**
   * 设置当前对话
   */

  setCurChatId(data) {
    this.curChatId = data;
  },
};
