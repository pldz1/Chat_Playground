import { defChatModelSettings } from "@/constants";

/**
 * 表示聊天信息存储的对象。
 */
export const ChatState = {
  /**
   * 对话路由列表
   */
  chatList: [],

  /**
   * 配置聊天模型的设置参数。
   */
  curChatModelSettings: structuredClone(defChatModelSettings),

  /**
   * 全部的对话信息
   * @type {PromptContent[]}
   */

  messages: [],

  /**
   * 设置对话的列表
   */
  resetChatList(data) {
    this.chatList = data;
  },

  /**
   * 设置当前对话模型参数
   */

  setCurChatModelSettings(data) {
    this.curChatModelSettings = data;
  },

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
