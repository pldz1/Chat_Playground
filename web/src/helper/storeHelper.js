import store from "../store/index.js";

class StoreHelper {
  /** 设置当前的用户名 */
  static setUserLoginInfo(userName, passWord) {
    store.state.user.setUserName(userName);
    const basicAuth = "Basic " + btoa(userName + ":" + passWord);
    store.state.user.setBasicAuth(basicAuth);
  }

  /** 设置登录的状态 */
  static setLoginInfo(state, userName, uid) {
    store.state.user.setLoginState(state);
    store.state.user.setUserName(userName);
    store.state.user.setUid(uid);
  }

  static getChatCid() {
    return store.state.chat.chatCid;
  }

  static setChatCid(data) {
    store.state.chat.chatCid = data;
  }

  static pushChatName(chatCid, chatName) {
    store.state.chat.pushChatName({
      chatCid: chatCid,
      chatName: chatName,
    });
  }

  static setTokens(data) {
    store.state.chat.setTokens(data);
  }

  static getChatParams() {
    return store.state.chat.chatParams;
  }

  static setChatParams(data) {
    return store.state.chat.resetChatParams(data);
  }

  static setTextEditObj(data) {
    store.state.app.setTextEditObj(data);
  }

  /** 设置如果按照当前的内容发送一次对话要消耗的tokens数量 */
  static updateTokens(data) {
    store.state.chat.tokens += data;
  }

  /** 从当前项目的store获得basic auth信息 */
  static getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: store.state.user.basicAuth,
    };
  }

  /** 修改对话历史的对话名称 */
  static editChatNameList(chatCid, chatName) {
    store.state.chat.editChatNameList({
      chatCid: chatCid,
      chatName: chatName,
    });
  }

  /** 根据chatCid从chatNameList中删除对话 */
  static deleteChatName(chatCid) {
    store.state.chat.deleteChatNameList(chatCid);
  }

  /** 根据SERVER传递来的用户设置的参数 更新store的值 */
  static setUserSettings(data) {
    store.state.user.resetUserDefaultSettings(data);
  }

  /** 重置用户默认的对话设置的参数 */
  static setUserChatParams(data) {
    store.state.user.resetUserDefaultChatParams(data);
  }

  /** 设置对话能够选择的模型列表 */
  static setChatModelList(data) {
    store.state.chat.setModelList(data);
  }

  /** 设置当前用户的历史对话的全部名称记录 */
  static setChatNameList(data) {
    store.state.chat.setChatNameList(data);
  }

  /** 获得默认的用户的对话设置参数 */
  static getUserDefaultChatParams() {
    return store.state.user.userDefaultChatParams;
  }

  /** 获得默认的用户设置参数 */
  static getUserDefaultSettings() {
    return store.state.user.userDefaultSettings;
  }
}

export default StoreHelper;
