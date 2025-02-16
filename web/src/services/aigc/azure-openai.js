import { AzureOpenAI } from "openai";

export class AzureOpenAIClient {
  constructor(endpoint, apiKey, deployment, apiVersion) {
    this.init(endpoint, apiKey, deployment, apiVersion);
  }

  init(endpoint, apiKey, deployment, apiVersion) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.deployment = deployment;
    this.apiVersion = apiVersion;

    this.client = null;

    if (apiKey && apiVersion) this.client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion, dangerouslyAllowBrowser: true });
  }

  update(endpoint, apiKey, deployment, apiVersion) {
    if (endpoint !== this.endpoint || apiKey !== this.apiKey || deployment !== this.deployment || apiVersion != this.apiVersion) {
      this.init(endpoint, apiKey, deployment, apiVersion);
    }
  }

  destroy() {
    this.endpoint = "";
    this.apiKey = "";
    this.deployment = "";
    this.apiVersion = "";
    this.client = null;
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

  async *sendMessage(messages, max_tokens, temperature, top_p, frequency_penalty, presence_penalty, stop) {
    if (this.client == null) {
      yield "模型初始化失败, 无法向服务器发送消息.";
      return;
    }

    try {
      const results = await this.client.chat.completions.create({
        messages: messages,
        max_tokens: max_tokens,
        temperature: temperature,
        top_p: top_p,
        frequency_penalty: frequency_penalty,
        presence_penalty: presence_penalty,
        stop: stop,
        stream: true,
        stream_options: { include_usage: true },
      });

      for await (const chunk of results) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    } catch (err) {
      yield String(err);
      return;
    }
  }

  /**
   * 处理输入的消息并返回流式响应，并支持回调
   * @param {Array<{role: string, content: string}>} messages - 输入的消息数组，每个对象包含 `role` 和 `content`
   * @param {function(string): Promise<void> | function(string): void} [callback=null] - 用于处理流响应的回调函数。每次接收到新的响应内容时，都会调用该回调，并将其作为参数传递给回调函数。如果提供回调，返回的流将逐步发送给回调（可选，默认值 `null`）。
   * @returns {Promise<void>} - 处理完成后返回 `Promise<void>`
   * @example
   * const client = new AzureOpenAIClient("OpenAI", "https://xxx", "xxx", "gpt-4o-mini");
   * const messages = [{ role: "user", content: "Hello!" }];
   *
   * await client.chat(messages, async (response) => {
   *   console.log("AI:", response);
   * });
   */
  async chat(messages, max_tokens = 800, temperature = 0.7, top_p = 0.95, frequency_penalty = 0, presence_penalty = 0, stop = [], callback = null) {
    for await (const response of this.sendMessage(messages, max_tokens, temperature, top_p, frequency_penalty, presence_penalty, stop)) {
      if (callback) await callback(response);
    }
  }
}
