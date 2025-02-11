import { AzureOpenAI } from "openai";

export class AzureOpenAIClient {
  constructor(type, endpoint, apiKey, deployment, apiVersion) {
    this.init(type, endpoint, apiKey, deployment, apiVersion);
  }

  init(type, endpoint, apiKey, deployment, apiVersion) {
    this.type = type;
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.apiVersion = apiVersion;

    this.client = null;

    if (apiKey && apiVersion) this.client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion, dangerouslyAllowBrowser: true });
  }

  update(type, endpoint, apiKey, deployment, apiVersion) {
    if (type !== this.type || endpoint !== this.endpoint || apiKey !== this.apiKey || deployment !== this.deployment || apiVersion != this.apiVersion) {
      this.init(type, endpoint, apiKey, deployment, apiVersion);
    }
  }

  /**
   * 处理输入的消息并返回流内容
   * @param {Array<{role: string, content: string}>} message - 输入的消息数组，每个对象包含 `role` 和 `content`
   * @returns {string} 处理后的流内容
   * @example
   * const client = new AzureOpenAIClient("OpenAI", "https://xxx", "xxx", "gpt-4o-mini");
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
   * const client = new AzureOpenAIClient("OpenAI", "https://xxx", "xxx", "gpt-4o-mini");
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
