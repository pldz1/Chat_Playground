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
 * 表示聊天信息存储的对象。
 */
export const ChatState = {
  /**
   * 全部的对话信息
   * @type {PromptContent[]}
   */

  messages: [],

  /**
   * 向对话数组末尾添加消息
   */
  pushMessages(msg) {
    this.messages.push(msg);
  },

  /**
   * 删除某个特定位置的消息
   */
  spliceMessages(index) {
    this.messages.splice(index, 1);
  },

  /**
   * 重置消息
   */

  resetMessages() {
    this.messages = [];
  },
};
