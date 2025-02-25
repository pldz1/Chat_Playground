/**
 * 当前模型信息
 * @property {string} name - 模型名称，默认为 "新增模型"
 * @property {string} apiType - 调用的库类型（"OpenAI" 或 "AzureOpenAI"）
 * @property {string} baseURL - OpenAI 专用：API 请求的基础 URL
 * @property {string} endpoint - Azure 专用：Azure OpenAI 的端点地址
 * @property {string} apiKey - API 访问密钥
 * @property {string} modelType - 要使用的模型名称（如 "gpt-4o") 模型真正的类型
 * @property {string} model - OpenAI 专用：要使用的 OpenAI 模型名称（如 "gpt-4o"）
 * @property {string} deployment - Azure 专用：Azure OpenAI 部署名称
 * @property {string} apiVersion - Azure 专用：Azure OpenAI 的协议版本
 */
export const model_T = { name: "", apiType: "", baseURL: "", endpoint: "", apiKey: "", modelType: "", model: "", deployment: "", apiVersion: "" };

/**
 * 提示内容对象
 * @typedef {Object} PromptContent
 * @property {"text"} type - 内容类型，例如 "text"。
 * @property {string} text - 提示的文本内容。
 */

/**
 * 提示信息对象
 * @typedef {Object} Prompt
 * @property {"system" | "user" | "assistant"} role - 角色，例如 "system" 或 "user"。
 * @property {PromptContent[]} content - 提示内容列表。
 */

/**
 * @property {number} passedMsgLen - 传递的消息长度。
 * @property {Prompt[]} prompts - 提示信息列表。
 * @property {number} max_tokens - 生成的最大 token 数。
 * @property {number} top_p - Nucleus 采样参数（控制高概率 token 的累积概率阈值）。
 * @property {number} temperature - 生成的随机性（较高的值使输出更随机）。
 * @property {number} frequency_penalty - 频率惩罚系数（降低重复使用相同 token 的可能性）。
 * @property {number} presence_penalty - 存在惩罚系数（鼓励使用新 token）。
 * @property {string[]} stop - 生成停止的标志符列表。
 */
export const chatModelSettings_T = {
  passedMsgLen: 10,
  prompts: [{ role: "system", content: [{ type: "text", text: "As an AI assistant, please make your responses more engaging by including lively emojis." }] }],
  max_tokens: 800,
  top_p: 0.95,
  temperature: 0.7,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: [],
};

/**
 * 图像模型的简单参数
 */
export const imageModelSettings_T = {
  model: null,
  prompt: "",
  size: "256x256",
  quality: "",
  mask: null,
  image: null,
  n: 1,
};
