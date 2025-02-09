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
  SET_USER_NAME(state, data) {
    state.user.setUserName(data);
  },

  /** @param {state} state */
  SET_LOGIN_STATE(state, data) {
    state.user.setIsLoggedIn(data);
  },

  /** @param {state} state */
  SET_CHAT_MODELS(state, data) {
    state.user.setChatModels(data);
  },
};

const actions = {
  async login({ commit }, username) {
    commit("SET_USER_NAME", username);
    commit("SET_LOGIN_STATE", true);
  },

  async setChatModels({ commit }, chatModels) {
    commit("SET_CHAT_MODELS", chatModels);
  },
};

export default createStore({
  state,
  mutations,
  actions,
});
