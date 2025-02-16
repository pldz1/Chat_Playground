import { chatModel_T, chatModelSettings_T } from "@/typings";

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
   */
  curChatModel: structuredClone(chatModel_T),

  /**
   * 当前用户有的对话指令
   */
  chatInsTemplateList: [],

  /**
   * 对话路由列表
   */
  chatList: [],

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
   * 配置聊天模型的设置参数。
   */
  curChatModelSettings: structuredClone(chatModelSettings_T),

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
   * 设置当前对话模型参数
   */

  setCurChatModelSettings(data) {
    this.curChatModelSettings = data;
  },

  /**
   * 设置对话的列表
   */
  resetChatList(data) {
    this.chatList = data;
  },

  /**
   * 增加对话
   */
  pushChatList(data) {
    this.chatList.push(data);
  },

  /**
   * 增加对话
   */
  deleteChatList(data) {
    const index = this.chatList.findIndex((item) => item.cid === data);
    if (index !== -1) {
      // 使用 splice 删除该对象
      this.chatList.splice(index, 1);
    }
  },

  /**
   * 修改对话
   */
  renameChatList(data) {
    const index = this.chatList.findIndex((item) => item.cid === data.cid);
    if (index !== -1) {
      this.chatList[index] = data;
    }
  },

  /**
   * 设置当前对话
   */

  setCurChatId(data) {
    this.curChatId = data;
  },
};
