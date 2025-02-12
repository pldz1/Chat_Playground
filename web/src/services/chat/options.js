/**
 * 帮助创建出 Chat对话卡片上 每个item的选项的按钮的具体功能的函数
 * 因为不同的函数 会有都用到 HTMLElement 上的操作 所以用了个静态类
 * */

import StoreHelper from "@/store/store-helper";
import { textToHtml } from "@/utils";
import { getContent, getUserTextMsg } from "./message";
import { showMessage, showMessageBox } from "@/utils/custom-message.js";
import { getChatItemAPI, deleteChatItemAPI, editChatItemAPI, reGenerateContentAPI } from "../../apis/chat.js";

export default class ChatOptions {
  static _chatContainer = this.init();

  /** init 函数保证操作的DOM对象是肯定存在的,不会出现 null 或者 undefined 的情况 */
  static init() {
    if (!this._chatContainer) {
      this._chatContainer = document.getElementById("chat-messages-container");
    }
    return this._chatContainer;
  }

  /** copyChatItem 把Assistant回答的markdown内容拷贝到剪切板上.
   * 目前Assitant的回答是不会出现图像的: https://platform.openai.com/docs/guides/vision */
  static async copyChatItem(chatIid) {
    var rea = await getChatItemAPI(chatIid);
    if (!rea.flag) {
      showMessage("error", `SERVER 获取消息内容失败【${rea.log}】`);
      return;
    }

    // 解析数据然后放入剪切板
    const content = getContent(rea.data);
    try {
      await navigator.clipboard.writeText(content.texts);
      showMessage("success", "复制markdown成功");
    } catch (err) {
      showMessage("error", "复制失败(WEB ERROR)");
    }
  }

  /** editChatItemCallback 是点击文本编辑对话框的保存按钮要调的回调函数的内容, 只针对纯文本的用户问题 */
  static async editChatItemCallback(newValue, chatIid) {
    if (!this.init()) return;
    const message = getUserTextMsg(newValue);
    var rea = await editChatItemAPI(chatIid, message);
    if (!rea.flag) {
      showMessage("error", `编辑用户提问失败! SERVER处理出错!【${rea.log}`);
      return;
    }
    // 修改纯文本的用户问题的 HTML DIV 的内容
    var tmpParentElem = this._chatContainer.querySelector(`#${chatIid}`);
    var tmpTextElem = tmpParentElem.querySelector(`.text`);
    tmpTextElem.innerHTML = textToHtml(newValue);
  }

  /** editChatItem 是修改用户提问的内容的函数, ⭐ 现在只能编辑用户问题是纯文本的.
   * 这个函数先会从服务器先获得对话内容的文本, 再把它通过事件总线传递给文本编辑的组件 */
  static async editChatItem(chatIid) {
    if (!this.init()) return;
    const itemElem = this._chatContainer.querySelector(`#${chatIid}`);
    const imgElem = itemElem.querySelector("img");
    if (imgElem) {
      showMessage("error", "暂时不支持修改包含图像的提问 🫠");
      return;
    }

    var rea = await getChatItemAPI(chatIid);
    if (!rea.flag) {
      showMessage("error", `服务器获取对话内容失败！【${rea.log}】 `);
      return;
    }

    const content = getContent(rea.data);
    // 向通用的文本编辑组件发送文本和回调函数
    StoreHelper.setTextEditObj({
      data: content.texts,
      options: {
        // 使用箭头函数确保 `this` 指向正确的上下文
        confirmCallback: (newValue) => this.editChatItemCallback(newValue, chatIid),
      },
    });
  }

  /** deleteChatItem 是删除对话的消息, 删除操作先确定是否真的删除 然后SERVER删除元素成功之后再删除网页的DIV */
  static async deleteChatItem(chatIid) {
    if (!this.init()) return;
    var flag = await showMessageBox("确定删除这条消息吗? (操作不可逆)");
    if (!flag) return;

    var rea = await deleteChatItemAPI(chatIid);
    if (!rea.flag) {
      showMessage("error", `服务器删除对话内容失败! 【${rea.log}】`);
      return;
    }

    var tmpDeleteElem = this._chatContainer.querySelector(`#${chatIid}`);
    if (tmpDeleteElem) {
      this._chatContainer.removeChild(tmpDeleteElem);
      showMessage("info", "删除成功");
    }
  }

  /** reGenerateMessage 表示重新生成对用户的这个问题的回答 */
  static async reGenerateMessage(chatIid) {
    if (!this.init()) return;
    var rea = await reGenerateContentAPI(chatIid);
    if (!rea.flag) {
      showMessage("error", `服务器处理重新生成对话内容过程失败! 【${rea.log}】`);
      return false;
    }

    // 删除目标 div 之后的所有 div 元素
    const targetDiv = this._chatContainer.querySelector(`#${chatIid}`);
    if (this._chatContainer && targetDiv) {
      let targetIndex = Array.prototype.indexOf.call(this._chatContainer.children, targetDiv);
      while (this._chatContainer.children.length > targetIndex + 1) {
        this._chatContainer.removeChild(this._chatContainer.lastChild);
      }
    }
    return true;
  }
}
