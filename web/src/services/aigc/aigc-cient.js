import store from "@/store";
import { dsAlert } from "@/utils";
import { chatModelTypeList } from "@/typings";

import { OpenAIClient } from "./openai.js";
import { AzureOpenAIClient } from "./azure-openai.js";
import { DeepSeekClient } from "./deepseek.js";
import { packMessageV1, packMessageV2 } from "../chat/message.js";

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

    const modelInfo = chatModelTypeList.find((item) => item.value == model.modelType);
    // 对于思考模型, 不要上下文并且要保证拿到的消息的格式
    if (modelInfo.isReasonModel) {
      try {
        await this.client.chat(data, {}, callback);
        return true;
      } catch (err) {
        dsAlert({ type: "warn", message: `模型请求失败: ${String(err)}` });
        callback({ content: `模型请求失败: ${String(err)}`, reasoning_content: "" });
      }
    } else {
      // 对于对话类型的模型, 要拿系统的指令和对话的参数去做请求
      try {
        const messages = this.getChatMessages(data, modelInfo.msgTypeVersion);
        const params = this.getChatParams();
        await this.client.chat(messages, params, callback);
        return true;
      } catch (err) {
        dsAlert({ type: "warn", message: `模型请求失败: ${String(err)}` });
        callback({ content: `模型请求失败: ${String(err)}`, reasoning_content: "" });
      }
    }
  }

  /**
   * 从store里拿出对话模型要的系统指令, 并且针对不同模型的格式, 包装好要对话的内容
   */
  getChatMessages(data, msgTypeVersion = "v2") {
    const cms = store.state.curChatModelSettings;
    const combineData = cms.prompts[0].content[0].text ? [...cms.prompts, ...data] : data;
    if (msgTypeVersion == "v1") {
      const messages = packMessageV1(combineData);
      return messages;
    } else {
      const messages = packMessageV2(combineData);
      return messages;
    }
  }

  /**
   * 从store里拿出基本的对话模型要的参数
   */
  getChatParams() {
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
    return params;
  }

  async generateImage(prompt, size, n) {
    const res = this.client.generateImage(prompt, size, n);
    return res;
  }
}
