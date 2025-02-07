import axios from "axios";
import { dsAlert } from "@/utils/daisy-ui/alert.js";

export const SHORTTIME = 2000;
export const LONGTIME = 10000;

/** 调用登录的接口
 * Axios中，第一个参数是URL
 *          第二个参数是数据body体，对应fast api封装的class.
 *          第三个参数是 axios 请求的配置选项，例如headers.
 * 比较规范的写法建议是将第二参数的body体内的变量做到与fast api的class格式一一对应.
 * */
export async function apiRequest(method, endpoint, body = {}) {
  try {
    const response = await axios({
      method: method,
      url: `${endpoint}`,
      data: body,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: LONGTIME,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      const msg = "Request timeout!";
      console.error(msg);
      dsAlert({ type: "error", message: msg });
    } else {
      console.error(error.message);
      dsAlert({ type: "error", message: error.message });
    }
    return { data: error.message || "Request failed!" };
  }
}

/**
 * 发送登录请求
 * @param {string} user - 用户名
 * @param {string} password - 密码
 * @return {Promise<{ flag: boolean, uid: string, log: string, role: string }>} 服务器返回的登录结果
 */
export const loginAPI = (user, password) => apiRequest("post", "/api/v1/login", { user, password });
