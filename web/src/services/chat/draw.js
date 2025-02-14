import store from "@/store/index.js";

import { dsAlert, getUuid } from "@/utils";
import { renderBlock } from "../markdown/md-render.js";
import { AIGCClient } from "../aigc/aigc-cient.js";
import { ChatElemCreator } from "./creator.js";
import { addMessage } from "../api/chat-api.js";

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

export class ChatDrawer extends ChatElemCreator {
  constructor(sync = false) {
    super(sync);

    this._isListenerActive = false;

    this.client = new AIGCClient("chat");

    this.tempAssTextDiv = null;
    this.tempAssTextMid = "";
    this.tempAssTextStr = "";
    this.renderQueue = [];
    this.isRendering = false;

    this.enqueueRender = this.enqueueRender.bind(this);
    this.processRenderQueue = this.processRenderQueue.bind(this);
    this.renderAssStream = this.renderAssStream.bind(this);
    this.draw = this.draw.bind(this);
  }

  init(id) {
    this.id = id;
    this.container = document.getElementById(this.id);
    this.addListener();
  }

  aigcInit() {
    this.client.init();
  }

  /**
   * 和 AIGC 进行对话
   */
  async chat(data) {
    this.removeListener();

    const chatData = { ...data, mid: getUuid("msg") };
    this.draw([chatData]);
    this.drawStreamAss();

    await store.dispatch("pushMessages", data);
    if (this.sync) await addMessage(chatData.mid, data);

    const { prompts, passedMsgLen } = store.state.user.chatModelSettings;
    const history = store.state.chat.messages;
    const valudHistory = history.slice(-Math.min(passedMsgLen, history.length));
    const messages = [...prompts, ...valudHistory];

    const flag = await this.client.chat(messages, this.enqueueRender);

    if (flag) {
      // 结束后立即更新对话历史
      const assistantData = {
        role: "assistant",
        content: [{ type: "text", text: this.tempAssTextStr }],
      };
      await store.dispatch("pushMessages", assistantData);

      if (this.sync) await addMessage(this.tempAssTextMid, assistantData);
    }

    this.addListener();
  }

  /**
   * 绘制对话的气泡卡片.
   * @param {Prompt[]} messages 是一个符合 v2 版本的对话数据结构
   */
  draw(messages) {
    for (let index = 0; index < messages.length; index++) {
      const msg = messages[index];
      if (!msg.mid) msg.mid = getUuid("msg");

      if (msg.role == "user") {
        this.addUserQHTMLElem(msg.content, msg.mid);
      }

      if (msg.role == "assistant") {
        this.addAssHTMLElem(msg.content, msg.mid);
      }
    }
  }

  enqueueRender(response) {
    this.tempAssTextStr += response;
    this.renderQueue.push(this.tempAssTextStr);
    // 如果当前没有渲染任务在进行，启动渲染队列
    if (!this.isRendering) {
      this.isRendering = true;
      this.processRenderQueue();
    }
  }

  processRenderQueue() {
    if (this.renderQueue.length === 0) {
      // 队列为空时标记渲染完成
      this.isRendering = false;
      return;
    }

    // 获取并移除队列中的第一个渲染任务
    const data = this.renderQueue.shift();
    // 执行渲染操作
    this.renderAssStream(data);
    // 继续处理下一个渲染任务
    setTimeout(this.processRenderQueue, 0);
  }

  renderAssStream() {
    if (!this.tempAssTextDiv) return;
    renderBlock(this.tempAssTextDiv, this.tempAssTextStr);
  }

  drawStreamAss() {
    this.tempAssTextMid = getUuid("msg");
    this.tempAssTextDiv = this.createAssTempElem(this.tempAssTextMid);
    this.tempAssTextStr = "";
    this.scrollToBottom();
  }

  /**
   * 删除容器下的全部div
   * */
  removeAllElem() {
    const divs = this.container.getElementsByTagName("div");
    while (divs.length > 0) {
      divs[0].remove();
    }
  }

  /**
   *
   * @param {PromptContent[]} content 消息的内容
   * @param {str} mid HTMLElement 的 id
   * @returns
   */
  addUserQHTMLElem(content, mid) {
    const res = this.createUserQHTMLElem(content, mid);
    if (!res) {
      dsAlert({ type: "warn", message: "绘制用户问题失败！" });
    }
  }

  /**
   *
   * @param {PromptContent[]} content 消息的内容
   * @param {str} mid HTMLElement 的 id
   * @returns
   */
  addAssHTMLElem(content, mid) {
    const res = this.createAssHTMLElem(content, mid);
    if (!res) {
      dsAlert({ type: "warn", message: "绘制机器人助理回答消息失败！" });
    }
  }

  /**
   * 给显示对话消息的界面增加鼠标移动事件的监听器, 用一个布尔来保证事件监听器没有被重复
   *  */
  addListener() {
    if (!this.container) return;
    if (this._isListenerActive) return;
    this.container.addEventListener("mouseover", this._mouseMoveLister);
    this.container.addEventListener("mouseout", this._mouseOutLister);
    this._isListenerActive = true;
  }

  /**
   * 移除对话消息的界面的鼠标移动事件监听器
   * */
  removeListener() {
    if (!this.container) return;
    if (!this._isListenerActive) return;
    this.container.removeEventListener("mouseover", this._mouseMoveLister);
    this.container.removeEventListener("mouseout", this._mouseOutLister);
    this._isListenerActive = false;
  }

  /**
   * 鼠标移动到对话的HTMLElement上要处理显示Options的函数
   */
  _mouseMoveLister(event) {
    const targetClass = event.target.closest(".cmbu-user-content, .cmba-assistant-content");
    if (targetClass) {
      const optionButtons = targetClass.querySelectorAll(".chat-md-bubble-options-button");
      optionButtons.forEach((div) => {
        div.classList.add("active");
      });
    }
  }

  /**
   * 鼠标移出了对话的HTMLElement上要处理隐藏Options的DIV的函数
   *  */
  _mouseOutLister() {
    const activeOptionButtons = document.querySelectorAll(".chat-md-bubble-options-button.active");
    activeOptionButtons.forEach((div) => {
      div.classList.remove("active");
    });
  }

  /**
   * 滚动到最底部
   */
  scrollToBottom = () => {
    if (!this.container) return;
    this.container.scrollTop = this.container.scrollHeight + 200;
  };
}

export default ChatDrawer;
