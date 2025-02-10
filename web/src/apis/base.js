import axios from "axios";
import { OpenAI, AzureOpenAI } from "openai";
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

class OpenAIClient {
  constructor(type, baseURL, apikey, deployment) {
    if (!OpenAIClient.instance) {
      this.type = type;
      this.baseURL = baseURL;
      this.apikey = apikey;
      this.deployment = deployment;

      OpenAIClient.instance = this;
    }
    return OpenAIClient.instance;
  }

  init() {
    if (this.type === "OpenAI")
      this.handler = new OpenAI({
        baseURL: this.baseURL,
        apiKey: this.apikey,
      });
    else{
      this.handler = new AzureOpenAI({
        endpoint : this.baseURL,
        apiKey: this.apikey
      });
    }
  }

  setApiKey(newApiKey) {
    this.apikey = newApiKey;
  }

  getApiKey() {
    return this.apikey;
  }
}
