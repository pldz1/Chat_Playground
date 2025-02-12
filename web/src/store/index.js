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
