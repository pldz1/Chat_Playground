import { createStore } from "vuex";
import { AppState } from "./app";
import { ChatState } from "./chat";
import { UserState } from "./user";

import { getChatParamsAPI } from "../apis/chat.js";
import chatCardHandler from "../helper/chat/card.js";

const state = {
  app: { ...AppState },
  user: { ...UserState },
  chat: { ...ChatState },
};

const mutations = {
  /** @param {state} state */
  SET_USER_NAME(state, data) {
    state.user.setUserName(data);
  },

  /** @param {state} state */
  SET_BASIC_AUTH(state, data) {
    state.user.setBasicAuth(data);
  },

  /** @param {state} state */
  SET_LOGIN_STATE(state, data) {
    state.user.setLoginState(data);
  },

  /** @param {state} state */
  SET_USER_DEFAULTCHATPARAMS(state, data) {
    state.user.resetUserDefaultChatParams(data);
  },

  /** @param {state} state */
  SET_USER_DEFAULTSETTINGS(state, data) {
    state.user.resetUserDefaultSettings(data);
  },

  /** @param {state} state */
  SET_USER_SHOWSETTINGUI(state, data) {
    state.user.setShowUserSettings(data);
  },

  /** @param {state} state */
  SET_CHATNAMELIST(state, data) {
    state.chat.setChatNameList(data);
  },

  /** @param {state} state */
  PUSH_CHATNAMELIST(state, data) {
    state.chat.pushChatName(data);
  },
  /** @param {state} state */
  EDIT_CHATNAMELIST(state, data) {
    state.chat.editChatNameList(data);
  },

  /** @param {state} state */
  DELETE_CHATNAMELIST(state, data) {
    state.chat.deleteChatNameList(data);
  },

  /** @param {state} state */
  SET_CHATMODELLIST(state, data) {
    state.chat.setModelList(data);
  },

  /** @param {state} state */
  SET_TOKENS(state, data) {
    state.chat.setTokens(data);
  },

  /** @param {state} state */
  SET_NEWCHATCID(state, data) {
    state.chat.setChatCid(data);
  },

  /** @param {state} state */
  async SET_CHATCID(state, data) {
    state.chat.setChatCid(data);
    // 不为空的chatCid代表切换对话就需要更新对话的参数和历史记录
    var rea = await getChatParamsAPI(data);
    if (rea.flag) state.chat.resetChatParams(rea.data);
    state.chat.tokens = await chatCardHandler.initChatHistory(data);
  },

  /** @param {state} state */
  SET_CHATPARAMS(state, data) {
    state.chat.resetChatParams(data);
  },

  /** @param {state} state */
  SET_CHAT_SHOWSETTINGUI(state, data) {
    state.chat.setEditChatSettings(data);
  },
};

export default createStore({
  state,
  mutations,
});
