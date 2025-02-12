import store from "@/store";
import { AIGC_CLIENT_TYPE, dsAlert } from "@/utils";

import { OpenAIClient } from "./openai";
import { AzureOpenAIClient } from "./azure-openai";

export class AIGCClient {
  /**
   *
   * @param {"chat" | "image" | "rt_audio"} type
   */
  constructor(type) {
    this.type = type;
    this.client = null;

    this.init();
  }

  init() {
    if (this.type == "chat") {
      const model = store.state.user.curChatModel;
      // OpenAI
      if (model.type == AIGC_CLIENT_TYPE.oi) {
        this.client = new OpenAIClient(model.baseURL, model.apiKey, model.model);
      }
      // Azure OpenAI
      else if (model.type == AIGC_CLIENT_TYPE.aoi) {
        this.client = new AzureOpenAIClient(model.endpoint, model.apiKey, model.deployment, model.apiVersion);
      }
    }
  }

  async chat(messages, callback = (response) => console.log(response)) {
    if (!this.client) {
      dsAlert({ type: "warn", message: "对话模型初始化失败, 请重新选择模式再尝试." });
    }

    const cms = store.state.user.chatModelSettings;
    await this.client.chat(
      [...cms.prompts, ...messages],
      cms.max_tokens,
      cms.temperature,
      cms.top_p,
      cms.frequency_penalty,
      cms.presence_penalty,
      cms.stop,
      callback,
    );
  }
}
