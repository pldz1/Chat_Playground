import { createStore } from "vuex";
import { ChatState } from "./chat.js";
import { UserState } from "./user.js";
import { ImageState } from "./image.js";

const state = {
  ...UserState,
  ...ChatState,
  ...ImageState,
};

const mutations = {
  /** @param {state} state */
  SET_USER_LOGIN_INFO(state, data) {
    state.setUserLoginInfo(data);
  },

  /** @param {state} state */
  SET_LOGIN_STATE(state, data) {
    state.setIsLoggedIn(data);
  },

  /** @param {state} state */
  SET_MODELS(state, data) {
    state.setModels(data);
  },

  /** @param {state} state */
  SET_CUR_CHAT_MODEL(state, data) {
    state.setCurChatModel(data);
  },

  /** @param {state} state */
  SET_CHAT_INS_TEMPLATE_LIST(state, data) {
    state.setChatInsTemplateList(data);
  },

  /** @param {state} state */
  SET_CURRENT_CHAT_MODEL_SETTINGS(state, data) {
    state.setCurChatModelSettings(data);
  },

  /** @param {state} state */
  RESET_CHAT_LIST(state, data) {
    state.resetChatList(data);
  },

  /** @param {state} state */
  SET_CURRENT_CHAT_ID(state, data) {
    state.setCurChatId(data);
  },

  /** @param {state} state */
  PUSH_MESSAGES(state, data) {
    state.pushMessages(data);
  },

  /** @param {state} state */
  SPLICE_MESSAGES(state, index) {
    state.spliceMessages(index);
  },

  /** @param {state} state */
  RESET_MESSAGES(state) {
    state.resetMessages();
  },

  /** @param {state} state */
  PUSH_IMAGES(state, data) {
    state.pushImages(data);
  },
};

const actions = {
  async login({ commit }, username, password = "", uid = "") {
    commit("SET_USER_LOGIN_INFO", { username, password, uid });
    commit("SET_LOGIN_STATE", true);
  },

  async setModels({ commit }, models) {
    commit("SET_MODELS", models);
  },

  async setCurChatModel({ commit }, model) {
    commit("SET_CUR_CHAT_MODEL", model);
  },

  async setChatInsTemplateList({ commit }, data) {
    commit("SET_CHAT_INS_TEMPLATE_LIST", data);
  },

  async setCurChatModelSettings({ commit }, data) {
    commit("SET_CURRENT_CHAT_MODEL_SETTINGS", data);
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

  async pushImages({ commit }, data) {
    commit("PUSH_IMAGES", data);
  },
};

export default createStore({
  state,
  mutations,
  actions,
});
