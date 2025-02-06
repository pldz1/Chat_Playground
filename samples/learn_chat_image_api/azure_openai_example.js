import { AzureOpenAI } from "openai";

const proxyUrl = "";
const endpoint = "xxxxxxxxxxxxxxxxxx";
const apiKey = "xxxxxxxxxxxxxxxxxx";
const chatDeployment = "4o";
const dellDelpoyment = "Dalle3";

/** 配置网络设置 */
async function useProxy(client) {
  if (!proxyUrl) return;

  // 动态导入 https-proxy-agent 模块
  const { HttpsProxyAgent } = await import("https-proxy-agent");

  // 使用 HttpsProxyAgent
  const agent = new HttpsProxyAgent(proxyUrl);

  const originalFetchWithTimeout = client.fetchWithTimeout;

  client.fetchWithTimeout = async (url, init, ms, controller) => {
    const { signal, ...options } = init || {};
    if (signal) signal.addEventListener("abort", () => controller.abort());

    const timeout = setTimeout(() => controller.abort(), ms);

    const fetchOptions = {
      signal: controller.signal,
      ...options,
      agent: agent,
    };
    if (fetchOptions.method) {
      // Custom methods like 'patch' need to be uppercased
      fetchOptions.method = fetchOptions.method.toUpperCase();
    }

    try {
      return await originalFetchWithTimeout.call(client, url, fetchOptions, ms, controller);
    } finally {
      clearTimeout(timeout);
    }
  };
}

/** ===== 非流式的对话测试 ===== */
async function noStreamChat() {
  const deployment = chatDeployment;
  const apiVersion = "2024-05-01-preview";
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
  useProxy(client);

  // 请求
  const results = await client.chat.completions.create({
    messages: [{ role: "user", content: [{ type: "text", text: "Hello?" }] }],
  });

  for (const choice of results.choices) {
    console.log(choice.message);
  }
}

/** ===== 流式的对话测试 ===== */
async function streamChat() {
  const apiVersion = "2024-05-01-preview";
  const deployment = chatDeployment;
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
  useProxy(client);

  // 请求
  const results = await client.chat.completions.create({
    messages: [{ role: "user", content: [{ type: "text", text: "Hello?" }] }],
    stream: true,
  });

  for await (const chunk of results) {
    console.log(chunk.choices[0]?.delta?.content || "");
  }
}

/** ===== 图片请求 ===== */
async function genDell3Pic() {
  // The prompt to generate images from
  const deployment = dellDelpoyment;
  const apiVersion = "2024-04-01-preview";
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
  useProxy(client);

  // 请求
  const results = await client.images.generate({ prompt: "cute cat" });
  console.log("image.url :", results.data[0].url);
}

/** ===== 测试主函数 ===== */
async function main() {
  await noStreamChat();
  await streamChat();
  await genDell3Pic();
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
