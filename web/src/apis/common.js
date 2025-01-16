import axios from "axios";
import StoreHelper from "@/store/store-helper";

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
      headers: StoreHelper.getHeaders(),
      timeout: 10000,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("TIME OVER");
    } else {
      console.error("REQUEST FAILED:", error.message);
    }
    return { data: error.message || "Network Error" };
  }
}
