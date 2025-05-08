import { createStore } from "vuex";
import { ChatState } from "./chat.js";
import { UserState } from "./user.js";
import { ImageState } from "./image.js";
import { ModalState } from "./modal.js";

const state = {
  ...UserState,
  ...ChatState,
  ...ImageState,
  ...ModalState,
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
  SET_HOST_URL(state, data) {
    state.setHostUrl(data);
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

  /**
   * ImageState 的接口
   */

  /** @param {state} state */
  RESET_IMAGE_LIST(state, data) {
    state.resetImageList(data);
  },

  /** @param {state} state */
  PUSH_IMAGE(state, data) {
    state.pushImage(data);
  },

  /** @param {state} state */
  DELETE_IMAGE(state, data) {
    state.deleteImage(data);
  },

  /**
   * ModalState 的接口
   */

  /** @param {state} state */
  SET_MODAL_IMAGE(state, data) {
    state.setModalImage(data);
  },
};

const actions = {
  async login({ commit }, username, password = "", uid = "") {
    if (username) {
      commit("SET_USER_LOGIN_INFO", { username, password, uid });
      commit("SET_LOGIN_STATE", true);
    } else {
      commit("SET_USER_LOGIN_INFO", { username: "", password: "", uid: "" });
      commit("SET_LOGIN_STATE", false);
    }
  },

  async setHostUrl({ commit }, data) {
    commit("SET_HOST_URL", data);
  },

  /**
   * chatState 的接口
   */
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

  /**
   * ImageState 的接口
   */

  async resetImageList({ commit }, data) {
    commit("RESET_IMAGE_LIST", data);
  },

  async pushImage({ commit }, data) {
    commit("PUSH_IMAGE", data);
  },

  async deleteImage({ commit }, data) {
    commit("DELETE_IMAGE", data);
  },

  /**
   * ModalState 的接口
   */
  async setModalImage({ commit }, data) {
    commit("SET_MODAL_IMAGE", data);
  },
};

export default createStore({
  state,
  mutations,
  actions,
});
