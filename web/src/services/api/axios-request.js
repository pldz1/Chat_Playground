import axios from "axios";
import store from "@/store";

const LONGTIME = 180000;

/** 调用登录的接口
 * Axios中，第一个参数是URL
 *          第二个参数是数据body体，对应fast api封装的class.
 *          第三个参数是 axios 请求的配置选项，例如headers.
 * 比较规范的写法建议是将第二参数的body体内的变量做到与fast api的class格式一一对应.
 * */
export async function apiRequest(method, endpoint, body = {}, headers = { "Content-Type": "application/json" }, timeout = LONGTIME) {
  try {
    const hostUrl = store.state.hostUrl;
    const response = await axios({
      method: method,
      url: `${hostUrl + endpoint}`,
      data: body,
      headers: headers,
      timeout: timeout,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout!");
    } else {
      console.error(error.message);
    }
    return { data: error.message || "Request failed!" };
  }
}
