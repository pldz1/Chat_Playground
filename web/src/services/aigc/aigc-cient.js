import store from "@/store";
import { dsAlert } from "@/utils";
import { reasonModelList } from "@/typings";

import { OpenAIClient } from "./openai.js";
import { AzureOpenAIClient } from "./azure-openai.js";
import { DeepSeekClient } from "./deepseek.js";

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

    // DeepSeek
    else if (actModel.apiType == "DeepSeek") {
      this.client = new DeepSeekClient(actModel.baseURL, actModel.apiKey, actModel.model);
    }
  }

  async chat(data, callback = (response) => console.log(response)) {
    const model = store.state.curChatModel;
    if (!this.client || !model.name || !model.apiKey) {
      dsAlert({ type: "warn", message: "对话模型初始化失败, 请重新选择模式再尝试." });
      callback({ content: "模型初始化失败, 检查模型选项!", reasoning_content: "" });
      return false;
    }

    if (reasonModelList.includes(model.modelType)) {
      // 对于思考模型
      try {
        await this.client.chat(data, {}, callback);
        return true;
      } catch (err) {
        dsAlert({ type: "warn", message: `模型请求失败: ${String(err)}` });
        callback({ content: `模型请求失败: ${String(err)}`, reasoning_content: "" });
      }
    } else {
      // 对于对话类型的模型
      const cms = store.state.curChatModelSettings;
      const params = {
        max_tokens: cms.max_tokens,
        temperature: cms.temperature,
        top_p: cms.top_p,
        frequency_penalty: cms.frequency_penalty,
        presence_penalty: cms.presence_penalty,
        stop: cms.stop,
        stream: true,
        stream_options: { include_usage: true },
      };

      // 加入系统指令
      try {
        const messages = cms.prompts[0].content[0].text ? [...cms.prompts, ...data] : data;
        await this.client.chat(messages, params, callback);
        return true;
      } catch (err) {
        dsAlert({ type: "warn", message: `模型请求失败: ${String(err)}` });
        callback({ content: `模型请求失败: ${String(err)}`, reasoning_content: "" });
      }
    }
  }

  async generateImage(prompt, size, n) {
    const res = this.client.generateImage(prompt, size, n);
    return res;
  }
}
