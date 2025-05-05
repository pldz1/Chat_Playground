/**
 * 一个空的模型要输入的信息模板
 * @type {T_Model}
 * */
export const defModelType = { name: "", apiType: "", baseURL: "", endpoint: "", apiKey: "", modelType: "", model: "", deployment: "", apiVersion: "" };

/**
 * 当前软件支持的集中接口的API类型
 */
export const apiTypeList = [
  { value: "OpenAI", name: "OpenAI" },
  { value: "Azure OpenAI", name: "Azure OpenAI" },
  { value: "DeepSeek", name: "DeepSeek" },
];

/**
 * 聊天模型类型列表
 * 包含支持的聊天模型类型及其相关信息的数组。
 * @type {T_ChatModelInfo[]}
 */
export const chatModelTypeList = [
  // ********* OpenAI 系列模型 截至 2025-04-27 *********
  // GPT-4.1 系列
  { value: "gpt-4.1", name: "gpt-4.1", isReasonModel: false, msgTypeVersion: "v2" },
  { value: "gpt-4.1-mini", name: "gpt-4.1-mini", isReasonModel: false, msgTypeVersion: "v2" },
  { value: "gpt-4.1-nano", name: "gpt-4.1-nano", isReasonModel: false, msgTypeVersion: "v2" },

  // GPT-4 系列
  { value: "gpt-4", name: "gpt-4", isReasonModel: false, msgTypeVersion: "v2" },
  { value: "gpt-4-turbo", name: "gpt-4-turbo", isReasonModel: false, msgTypeVersion: "v2" },
  { value: "gpt-4o", name: "gpt-4o", isReasonModel: false, msgTypeVersion: "v2" },
  { value: "gpt-4o-mini", name: "gpt-4o-mini", isReasonModel: false, msgTypeVersion: "v2" },

  // GPT-3.5 系列
  { value: "gpt-3.5", name: "gpt-3.5", isReasonModel: false, msgTypeVersion: "v1" },
  { value: "gpt-3.5-turbo", name: "gpt-3.5-turbo", isReasonModel: false, msgTypeVersion: "v1" },

  // 推理模型（Reasoning Models）
  { value: "o1", name: "o1", isReasonModel: true, msgTypeVersion: "v1" },
  { value: "o1-mini", name: "o1-mini", isReasonModel: true, msgTypeVersion: "v1" },
  { value: "o1-preview", name: "o1-preview", isReasonModel: true, msgTypeVersion: "v1" },
  { value: "o1-pro", name: "o1-pro", isReasonModel: true, msgTypeVersion: "v1" },
  { value: "o3", name: "o3", isReasonModel: true, msgTypeVersion: "v1" },
  { value: "o3-mini", name: "o3-mini", isReasonModel: true, msgTypeVersion: "v1" },
  { value: "o3-mini-high", name: "o3-mini-high", isReasonModel: true, msgTypeVersion: "v1" },
  { value: "o4-mini", name: "o4-mini", isReasonModel: true, msgTypeVersion: "v1" },
  { value: "o4-mini-high", name: "o4-mini-high", isReasonModel: true, msgTypeVersion: "v1" },

  // ********* DeepSeek 系列模型 *********
  { value: "deepseek-v3", name: "deepseek-v3", isReasonModel: false, msgTypeVersion: "v1" },
  { value: "deepseek-r1", name: "deepseek-r1", isReasonModel: true, msgTypeVersion: "v1" },
];

/**
 * @type {T_ChatParams}
 * 对话模型的参数的模板
 * */
export const defChatModelSettings = {
  passedMsgLen: 10,
  prompts: [{ role: "system", content: [{ type: "text", text: "As an AI assistant, please make your responses more engaging by including lively emojis." }] }],
  max_tokens: 2000,
  top_p: 0.95,
  temperature: 0.7,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: [],
};

/**
 * 当前软件支持的图像的模型的类型
 */
export const imageModelTypeList = [
  { value: "dalle2", name: "dalle2" },
  { value: "dalle3", name: "dalle3" },
];

/**
 * 图像模型的简单参数
 * @type {T_ImageModelSettings}
 */
export const defImageModelSeting = {
  model: null,
  prompt: "",
  size: "1024x1024",
  quality: "",
  mask: null,
  image: null,
  n: 1,
};

/**
 * 图像模型的尺寸参数
 */
export const imageModelSize = [
  { name: "1024x1024", value: "1024x1024" },
  { name: "1024x1792", value: "1024x1792" },
  { name: "1792x1024", value: "1792x1024" },
];

/**
 * 当前软件支持的实时语音的模型的类型
 */
export const rtaudioModelTypeList = [
  { value: "gpt-4o-realtime-preview", name: "gpt-4o-realtime-preview" },
  { value: "gpt-4o-mini-realtime-preview", name: "gpt-4o-mini-realtime-preview" },
];
