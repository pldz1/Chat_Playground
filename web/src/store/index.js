import { createStore } from "vuex";
import { AppState } from "./app";
import { ChatState } from "./chat";
import { UserState } from "./user";

const state = {
  app: { ...AppState },
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
};

export default createStore({
  state,
  mutations,
  actions,
});
