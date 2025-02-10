import { apiRequest } from "./base";

/**
 * 发送登录请求
 * @param {string} user - 用户名
 * @param {string} password - 密码
 * @return {Promise<{ flag: boolean, uid: string, log: string, role: string }>} 服务器返回的登录结果
 */
export const loginAPI = (username, password) => apiRequest("post", "/api/v1/login", { username, password });
