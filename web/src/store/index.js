import { createStore } from "vuex";
import { ChatState } from "./chat";
import { UserState } from "./user";

const state = {
  user: { ...UserState },
  chat: { ...ChatState },
};

const mutations = {
  /** @param {state} state */
  SET_USER_LOGIN_INFO(state, data) {
    state.user.setUserLoginInfo(data);
  },

  /** @param {state} state */
  SET_LOGIN_STATE(state, data) {
    state.user.setIsLoggedIn(data);
  },

  /** @param {state} state */
  SET_CHAT_MODELS(state, data) {
    state.user.setChatModels(data);
  },

  /** @param {state} state */
  SET_CUR_CHAT_MODEL(state, data) {
    state.user.setCurChatModel(data);
  },

  /** @param {state} state */
  SET_CHAT_MODEL_SETTINGS(state, data) {
    state.user.setChatModelSettings(data);
  },

  /** @param {state} state */
  PUSH_CHAT_LIST(state, data) {
    state.user.pushChatList(data);
  },

  /** @param {state} state */
  DELETE_CHAT_LIST(state, data) {
    state.user.deleteChatList(data);
  },

  /** @param {state} state */
  RENAME_CHAT_LIST(state, data) {
    state.user.renameChatList(data);
  },

  /** @param {state} state */
  RESET_CHAT_LIST(state, data) {
    state.user.resetChatList(data);
  },

  /** @param {state} state */
  SET_CURRENT_CHAT_ID(state, data) {
    state.user.setCurChatId(data);
  },

  /** @param {state} state */
  PUSH_MESSAGES(state, data) {
    state.chat.pushMessages(data);
  },

  /** @param {state} state */
  SPLICE_MESSAGES(state, index) {
    state.chat.spliceMessages(index);
  },

  /** @param {state} state */
  RESET_MESSAGES(state) {
    state.chat.resetMessages();
  },
};

const actions = {
  async login({ commit }, username, password = "", uid = "") {
    commit("SET_USER_LOGIN_INFO", { username, password, uid });
    commit("SET_LOGIN_STATE", true);
  },

  async setChatModels({ commit }, chatModels) {
    commit("SET_CHAT_MODELS", chatModels);
  },

  async setCurChatModel({ commit }, model) {
    commit("SET_CUR_CHAT_MODEL", model);
  },

  async setChatModelSettings({ commit }, data) {
    commit("SET_CHAT_MODEL_SETTINGS", data);
  },

  async pushChatList({ commit }, data) {
    commit("PUSH_CHAT_LIST", data);
  },

  async deleteChatList({ commit }, data) {
    commit("DELETE_CHAT_LIST", data);
  },

  async renameChatList({ commit }, data) {
    commit("RENAME_CHAT_LIST", data);
  },

  async resetChatList({ commit }, data) {
    commit("RESET_CHAT_LIST", data);
  },

  async setCurChatId({ commit }, data) {
    commit("SET_CURRENT_CHAT_ID", data);
  },

  async pushMessages({ commit }, data) {
    commit("PUSH_MESSAGES", data);
  },

  async spliceMessages({ commit }, index) {
    commit("SPLICE_MESSAGES", index);
  },

  async resetMessages({ commit }) {
    commit("RESET_MESSAGES");
  },
};

export default createStore({
  state,
  mutations,
  actions,
});
