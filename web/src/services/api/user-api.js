import store from "@/store";
import { apiRequest, dsAlert, isArrayTypeStr } from "@/utils";

/**
 * 发送登录请求
 * @param {string} user - 用户名
 * @param {string} password - 密码
 * @return {Promise<{ flag: boolean, uid: string, log: string, role: string }>} 服务器返回的登录结果
 */
export const loginAPI = (username, password) => apiRequest("post", "/api/v1/login", { username, password });

/**
 * 发送获得对话模型的全部内容的请求
 * @return {Promise<{ flag: boolean, data: string, log: string }>} 服务器返回的登录结果
 */
export const getChatModelsAPI = (username) => apiRequest("post", "/api/v1/user/getChatModels", { username });

/**
 * 发送设置对话模型的请求
 * @return {Promise<{ flag: boolean, data: string, log: string }>} 服务器返回的登录结果
 */
export const setChatModelsAPI = (username, data) => apiRequest("post", "/api/v1/user/setChatModels", { username, data });

/**
 * 发送登录请求
 * @param {string} user - 用户名
 * @param {string} password - 密码
 * @return {Promise<boolean>} 服务器返回的登录结果
 */
export async function login(username, password) {
  const res = await loginAPI(username, password);
  if (!res.flag) {
    dsAlert({ type: "error", message: `Login failed: ${res.log}` });
    return false;
  }

  dsAlert({ type: "success", message: `Login successfully!` });
  await store.dispatch("login", username);
  return true;
}

/**
 * 获取全部的对话模型信息然后更新store
 * @returns {Promise<boolean>}
 */
export async function getChatModels(username) {
  const res = await getChatModelsAPI(username.value);

  if (!res.flag) {
    dsAlert({ type: "error", message: `从数据库拿对话模型数据失败: ${res.log}` });
    return false;
  }

  if (res.data == "") {
    store.dispatch("setChatModels", []);
    dsAlert({ type: "warn", message: `用户没有对话模型, 请先在用户管理内添加后使用 Chat 功能.` });
    return true;
  }

  if (isArrayTypeStr(res.data)) {
    const chatModels = JSON.parse(res.data);
    store.dispatch("setChatModels", chatModels);
    return true;
  } else {
    dsAlert({ type: "error", message: `从数据库拿对话模型解析失败, 不是有效的数据类型: ${res.data}` });
    store.dispatch("setChatModels", []);
    return false;
  }
}

/**
 * 获取全部的对话模型信息然后更新store
 * @param {Array} data 模型数据,注意这个数据类型是一个数组.
 * @returns {Promise<boolean>}
 */
export async function setChatModels(username, data) {
  if (!Array.isArray(data)) {
    dsAlert({ type: "error", message: "要设置到数据库里的模型数据不是数组类型的." });
    return false;
  }

  await store.dispatch("setChatModels", data);

  const res = await setChatModelsAPI(username.value, JSON.stringify(data));

  if (!res.flag) {
    dsAlert({ type: "error", message: `向数据库设置对话模型数据失败: ${res.log}` });
    return false;
  }
  return true;
}
