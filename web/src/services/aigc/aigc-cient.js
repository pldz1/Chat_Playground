import store from "@/store";
import { dsAlert } from "@/utils";

import { OpenAIClient } from "./openai";
import { AzureOpenAIClient } from "./azure-openai";

export class AIGCClient {
  /**
   * @param {"chat" | "image" | "rt_audio"} type
   */
  constructor(type) {
    this.type = type;
    this.client = null;

    this.init(null);
  }

  init(model = null) {
    const actModel = this.type == "chat" ? store.state.curChatModel : model;
    if (!actModel) return;

    // OpenAI
    if (actModel.apiType == "OpenAI") {
      this.client = new OpenAIClient(actModel.baseURL, actModel.apiKey, actModel.model);
    }

    // Azure OpenAI
    else if (actModel.apiType == "Azure OpenAI") {
      this.client = new AzureOpenAIClient(actModel.endpoint, actModel.apiKey, actModel.deployment, actModel.apiVersion);
    }
  }

  async chat(messages, callback = (response) => console.log(response)) {
    if (!this.client) {
      dsAlert({ type: "warn", message: "对话模型初始化失败, 请重新选择模式再尝试." });
      callback("模型初始化失败, 检查模型选项!");
      return false;
    }

    const cms = store.state.curChatModelSettings;
    await this.client.chat(messages, cms.max_tokens, cms.temperature, cms.top_p, cms.frequency_penalty, cms.presence_penalty, cms.stop, callback);
    return true;
  }

  async generateImage(prompt, size, n) {
    const res = this.client.generateImage(prompt, size, n);
    return res;
  }
}
