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

    this.tmpAssIsResponsingElFlag = true;
    this.tmpAssContentDiv = null;
    this.tmpAssReasoningDiv = null;
    this.tmpAssContentMid = "";
    this.tmpAssContentData = { content: "", reasoning_content: "" };
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

    const passedMsgLen = store.state.curChatModelSettings.passedMsgLen;
    const history = store.state.messages;
    const messages = history.slice(-Math.min(passedMsgLen, history.length));

    const flag = await this.client.chat(messages, this.enqueueRender);

    if (flag) {
      // 结束后立即更新对话历史
      if (this.tmpAssContentData.content == "") {
        // 如果是出现无效的返回结果, 删除 markdown 上正在思考的话
        this.forceRemoveResponsingEl();
        this.draw([{ role: "assistant", content: [{ type: "text", text: "请求超时,无有效内容！" }] }]);
      } else {
        const assistantData = {
          role: "assistant",
          content: [{ type: "text", text: this.tmpAssContentData.content }],
        };

        await store.dispatch("pushMessages", assistantData);
        if (this.sync) await addMessage(this.tmpAssContentMid, assistantData);
      }
    }

    this.addListener();
  }

  /**
   * 删除正在响应的 HTML Element
   * 如果是思考模型在思考, 或者是遇到超时, 这两个情况需要我们删除这个正在响应的 HTML Element
   */

  forceRemoveResponsingEl() {
    if (this.tmpAssIsResponsingElFlag) {
      const assEl = this.container.querySelector(".markdown-p-text");
      if (assEl) assEl.remove();
      this.tmpAssIsResponsingElFlag = false;
    }
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

  /**
   * 得到响应,就把要渲染的文本塞入渲染队列
   */
  enqueueRender(response) {
    if (!response.flag) {
      if (this.tmpAssContentDiv) {
        this.tmpAssContentDiv.innerHTML = response.content;
      } else {
        dsAlert({ type: "error", message: response.content });
      }
      return;
    }

    this.tmpAssContentData.content += response?.content || "";
    this.tmpAssContentData.reasoning_content += response?.reasoning_content || "";

    // 因为最新的文本都被记录在 this.tmpAssContentData, 所以可以 push 任意的内容
    this.renderQueue.push("");
    // 如果当前没有渲染任务在进行，启动渲染队列
    if (!this.isRendering) {
      this.isRendering = true;
      this.processRenderQueue();
    }
  }

  /**
   * 处理渲染的队列
   * 注意我们只拿最后一个入队的去做渲染, 也就是拿最新的数据, 旧的数据清空
   */
  processRenderQueue() {
    if (this.renderQueue.length === 0) {
      // 队列为空时标记渲染完成
      this.isRendering = false;
      return;
    }

    // 执行最新的数据做渲染, 清空队列
    this.renderQueue = [];
    // 执行渲染操作
    this.renderAssStream();
    // 继续处理下一个渲染任务
    setTimeout(this.processRenderQueue, 0);
  }

  /**
   * 渲染具体的文本内容在整个界面上
   */
  renderAssStream() {
    // 没有关键的存放响应文本的div 直接返回,不做任何操作
    if (!this.tmpAssContentDiv) return;

    const { reasoning_content, content } = this.tmpAssContentData;

    // 如果这次有思考的内容 那么要试着加入思考的div并渲染
    if (reasoning_content) {
      this.tmpAssReasoningDiv = this.tmpAssReasoningDiv || this.insertReasoningElem(this.tmpAssContentDiv);
      if (this.tmpAssReasoningDiv) {
        this.forceRemoveResponsingEl();
        renderBlock("markdown-content", this.tmpAssReasoningDiv, reasoning_content);
      }
    }

    // 渲染文本内容
    if (content) {
      renderBlock("markdown-content", this.tmpAssContentDiv, content);
    }
  }

  /**
   * 开始绘制机器人助理响应的文本内容，同时也是全部这个绘图类的关键属性重置的函数入口
   */
  drawStreamAss() {
    this.tmpAssContentMid = getUuid("msg");
    this.tmpAssContentDiv = this.createAssTempElem(this.tmpAssContentMid);
    this.tmpAssIsResponsingElFlag = true;
    this.tmpAssReasoningDiv = null;
    this.tmpAssContentData = { content: "", reasoning_content: "" };
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
