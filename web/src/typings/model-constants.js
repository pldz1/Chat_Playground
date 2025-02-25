export const apiTypeList = [
    { value: "OpenAI", name: "OpenAI" },
    { value: "Azure OpenAI", name: "Azure OpenAI" },
    { value: "DeepSeek", name: "DeepSeek" },
  ];
  
  /**
   * @typedef {Object} ChatModelType
   * @property {string} value - 模型的值
   * @property {string} name - 模型的名字
   * @property {boolean} isReasonModel - 是否为推理模型
   * @property {string} msgTypeVersion - 消息版本
   */
  
  /**
   * 聊天模型类型列表
   * 包含支持的聊天模型类型及其相关信息的数组。
   * @type {ChatModelType[]}
   */
  export const chatModelTypeList = [
    { value: "gpt-4o", name: "gpt-4o", isReasonModel: false, msgTypeVersion: "v2" },
    { value: "gpt-4o-mini", name: "gpt-4o-mini", isReasonModel: false, msgTypeVersion: "v2" },
    { value: "gpt-4", name: "gpt-4", isReasonModel: false, msgTypeVersion: "v2" },
    { value: "gpt-4-turbo", name: "gpt-4-turbo", isReasonModel: false, msgTypeVersion: "v2" },
    { value: "gpt-3.5", name: "gpt-3.5", isReasonModel: false, msgTypeVersion: "v1" },
    { value: "gpt-3.5-turbo", name: "gpt-3.5-turbo", isReasonModel: false, msgTypeVersion: "v1" },
    { value: "o1", name: "o1", isReasonModel: true, msgTypeVersion: "v1" },
    { value: "o1-mini", name: "o1-mini", isReasonModel: true, msgTypeVersion: "v1" },
    { value: "o1-pro", name: "o1-pro", isReasonModel: true, msgTypeVersion: "v1" },
    { value: "o3-mini", name: "o3-mini", isReasonModel: true, msgTypeVersion: "v1" },
    { value: "o3-mini-high", name: "o3-mini-high", isReasonModel: true, msgTypeVersion: "v1" },
    { value: "deepseek-v3", name: "deepseek-v3", isReasonModel: false, msgTypeVersion: "v1" },
    { value: "deepseek-r1", name: "deepseek-r1", isReasonModel: true, msgTypeVersion: "v1" },
  ];
  
  export const imageModelTypeList = [
    { value: "dalle2", name: "dalle2" },
    { value: "dalle3", name: "dalle3" },
  ];
  
  export const rtaudioModelTypeList = [
    { value: "gpt-4o-realtime-preview", name: "gpt-4o-realtime-preview" },
    { value: "gpt-4o-mini-realtime-preview", name: "gpt-4o-mini-realtime-preview" },
  ];
  
  export const imageModelSize = [
    { name: "1024x1024", value: "1024x1024" },
    { name: "1024x1792", value: "1024x1792" },
    { name: "1792x1024", value: "1792x1024" },
  ];
  