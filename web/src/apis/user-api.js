import { apiRequest } from "./app-api.js";
import { dsAlert } from "@/utils/daisy-ui/alert.js";

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
