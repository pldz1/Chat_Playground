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

    this.init();
  }

  init() {
    if (this.type == "chat") {
      const model = store.state.curChatModel;
      // OpenAI
      if (model.apiType == "OpenAI") {
        this.client = new OpenAIClient(model.baseURL, model.apiKey, model.model);
      }

      // Azure OpenAI
      else if (model.apiType == "Azure OpenAI") {
        this.client = new AzureOpenAIClient(model.endpoint, model.apiKey, model.deployment, model.apiVersion);
      }
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
}
