import { OpenAI } from "openai";

export class OpenAIClient {
  constructor(type, baseURL, apikey, model) {
    this.init(type, baseURL, apikey, model);
  }

  init(type, baseURL, apikey, model) {
    this.type = type;
    this.baseURL = baseURL;
    this.apikey = apikey;
    this.model = model;
    this.client = null;

    if (apikey) this.client = new OpenAI({ baseURL: baseURL, apikey: apikey, dangerouslyAllowBrowser: true });
  }

  update(type, baseURL, apikey, model) {
    if (type !== this.type || baseURL !== this.baseURL || apikey !== this.apikey || model !== this.model) {
      this.init(type, baseURL, apikey, model);
    }
  }

  /**
   * 处理输入的消息并返回流内容
   * @param {Array<{role: string, content: string}>} message - 输入的消息数组，每个对象包含 `role` 和 `content`
   * @returns {string} 处理后的流内容
   * @example
   * const client = new OpenAIClient("OpenAI", "https://xxx", "xxx", "gpt-4o-mini");
   * const messages = [{ role: "user", content: "Hello!" }];
   *
   * for await (const response of client.sendMessage(messages)) {
   *   console.log(response);
   * }
   */

  async *sendMessage(messages) {
    if (this.client == null) {
      yield "模型初始化失败, 无法向服务器发送消息.";
      return;
    }

    const results = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
      stream: true,
    });

    for await (const chunk of results) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }

  /**
   * 处理输入的消息并返回流式响应，并支持回调
   * @param {Array<{role: string, content: string}>} messages - 输入的消息数组，每个对象包含 `role` 和 `content`
   * @param {function(string): Promise<void> | function(string): void} [callback=null] - 处理流响应的回调函数（可选）
   * @returns {Promise<void>} - 处理完成后返回 `Promise<void>`
   * @example
   * const client = new OpenAIClient("OpenAI", "https://xxx", "xxx", "gpt-4o-mini");
   * const messages = [{ role: "user", content: "Hello!" }];
   *
   * await client.chat(messages, async (response) => {
   *   console.log("AI:", response);
   * });
   */
  async chat(messages, callback = (response) => console.log(response)) {
    for await (const response of this.sendMessage(messages)) {
      if (callback) await callback(response);
    }
  }
}
