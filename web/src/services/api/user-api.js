import store from "@/store";
import { apiRequest, dsAlert } from "@/utils";

/**
 * 发送登录请求
 * @param {string} user - 用户名
 * @param {string} password - 密码
 * @return {Promise<{ flag: boolean, uid: string, log: string, role: string }>} 服务器返回的登录结果
 */
export const loginAPI = (username, password) => apiRequest("post", "/api/v1/login", { username, password });

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
