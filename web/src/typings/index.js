/**
 * 提示内容对象
 * @typedef {Object} PromptContent
 * @property {"text" | "image_url"} type - 内容类型，例如 "text"。
 * @property {string} text - 提示的文本内容。
 */

/**
 * 提示信息对象
 * @typedef {Object} Prompt
 * @property {"system" | "user" | "assistant"} role - 角色，例如 "system" 或 "user"。
 * @property {PromptContent[]} content - 提示内容列表。
 */

/**
 * 一个能在这个APP用的模型信息
 * @typedef {Object} T_Model
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

/**
 * @typedef {Object} T_ChatModelInfo
 * @property {string} value - 模型的值
 * @property {string} name - 模型的名字
 * @property {boolean} isReasonModel - 是否为推理模型
 * @property {string} msgTypeVersion - 消息版本
 */

/**
 * 图像模型的简单参数配置。
 * 该对象用于存储与图像生成或处理相关的设置。
 * @typedef {Object} T_ImageModelSettings
 * @property {string|null} model - 使用的图像模型，可以是模型的名称或ID。默认为 `null`，表示未指定。
 * @property {string} prompt - 生成图像时的提示文本，用于指导模型生成图像的内容。默认为空字符串。
 * @property {string} size - 生成图像的尺寸，格式为 "宽x高"（例如 "256x256"）。默认为 "256x256"。
 * @property {string} quality - 生成图像的质量设置。可以为空，表示没有指定特定质量。
 * @property {Object|null} mask - 用于图像生成的掩码，通常是一个图像或区域描述，用于定义生成的部分。默认为 `null`。
 * @property {Object|null} image - 输入的原始图像，用于图像编辑或增强。默认为 `null`。
 * @property {number} n - 生成的图像数量。默认为 `1`，表示生成一张图像。
 */

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
 * 对话模型的一些可能有的参数的集合
 * @typedef {Object} T_ChatParams
 * @property {number} passedMsgLen - 传递的消息长度。
 * @property {Prompt[]} prompts - 提示信息列表。
 * @property {number} max_tokens - 生成的最大 token 数。
 * @property {number} top_p - Nucleus 采样参数（控制高概率 token 的累积概率阈值）。
 * @property {number} temperature - 生成的随机性（较高的值使输出更随机）。
 * @property {number} frequency_penalty - 频率惩罚系数（降低重复使用相同 token 的可能性）。
 * @property {number} presence_penalty - 存在惩罚系数（鼓励使用新 token）。
 * @property {string[]} stop - 生成停止的标志符列表。
 */

/**
 * 表示一个聊天实例模板的列表。
 * 每个模板包含一个 id、name 和一个 value（通常是与模板相关的描述或提示）。
 *
 * @typedef {Object} ChatInsTemplate
 * @property {string} id - 模板的唯一标识符。
 * @property {string} name - 模板的名称，可以包含表情符号以便更好地进行视觉标识。
 * @property {string} value - 与模板相关的描述或提示，用于定义模板的功能或用途。
 * */
