import "@/typings";
import store from "@/store";

import { dsAlert, textToHtml } from "@/utils";
import { renderBlock } from "../markdown/md-render.js";
import { delete16, app18, copy16 } from "@/assets/svg";
import { deleteMessage } from "../api/chat-api.js";

export class ChatElemCreator {
  constructor(sync = false) {
    this.id = "";
    this.container = null;
    this.sync = sync;

    this.createUserQHTMLElem = this.createUserQHTMLElem.bind(this);
    this.createAssHTMLElem = this.createAssHTMLElem.bind(this);
    this.createAssResponseElem = this.createAssResponseElem.bind(this);
    this.createAssTempElem = this.createAssTempElem.bind(this);
    this.findMsgIndex = this.findMsgIndex.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  /**
   *
   * @param {str} mid HTMLElement 的 id
   * @param {PromptContent[]} content 消息的内容
   * @returns
   */
  createUserQHTMLElem(content, mid) {
    if (!this.container) return null;
    const userDiv = document.createElement("div");
    userDiv.classList.add("chat-md-bubble-user");
    userDiv.id = mid;

    const userContentDiv = document.createElement("div");
    userContentDiv.classList.add("cmbu-user-content");

    const contentAreaDiv = document.createElement("div");
    contentAreaDiv.classList.add("cmbu-content-area");

    const imgAreaElem = document.createElement("div");
    imgAreaElem.classList.add("cmbu-img-area");
    const textDiv = document.createElement("div");
    textDiv.classList.add("cmbu-content-text");

    content.forEach((prompt) => {
      if (prompt.type == "text") {
        textDiv.innerHTML = textToHtml(prompt.text);
      }

      if (prompt.type == "image_url") {
        const imgItem = document.createElement("img");
        imgItem.classList.add("cmbu-item");
        imgItem.src = prompt.image_url.url;
        imgAreaElem.appendChild(imgItem);
      }
    });

    const hasImgContent = content.some((obj) => obj.type === "image_url");
    if (hasImgContent) {
      contentAreaDiv.appendChild(imgAreaElem);
    }

    contentAreaDiv.appendChild(textDiv);
    userContentDiv.appendChild(contentAreaDiv);

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("cmbu-options");

    const deleteButtonDiv = document.createElement("div");
    deleteButtonDiv.classList.add("chat-md-bubble-options-button", "tooltip", "tooltip-top");
    deleteButtonDiv.dataset.tip = "删除消息";
    deleteButtonDiv.innerHTML = delete16;
    optionsDiv.appendChild(deleteButtonDiv);

    deleteButtonDiv.addEventListener("click", async () => {
      this.deleteMessage(mid);
      userDiv.remove();
      deleteMessage(mid);
    });

    userContentDiv.appendChild(optionsDiv);
    userDiv.appendChild(userContentDiv);
    this.container.appendChild(userDiv);

    return userDiv;
  }

  /**
   *
   * @param {str} mid HTMLElement 的 id
   * @param {PromptContent[]} content 消息的内容
   * @returns
   */
  createAssHTMLElem(content, reasoning_content, mid) {
    if (!this.container) return null;

    const assistantDiv = document.createElement("div");
    assistantDiv.id = mid;
    assistantDiv.classList.add("chat-md-bubble-assistant");

    this.container.appendChild(assistantDiv);

    const textDiv = this.createAssResponseElem(assistantDiv, mid, false);

    if (reasoning_content) {
      const reasoningTextDiv = this.insertReasoningElem(textDiv);
      renderBlock("markdown-content", reasoningTextDiv, reasoning_content);
    }

    const text = content[0].text;
    renderBlock("markdown-content", textDiv, text);

    return assistantDiv;
  }

  /**
   * 创建一个助理机器人正在回答的 HTML Element
   */
  createAssResponseElem(assistantDiv, mid, thinking = false) {
    const assistantIconDiv = document.createElement("div");
    assistantIconDiv.classList.add("cmba-assistant-icon");
    assistantIconDiv.innerHTML = app18;

    const assistantContentDiv = document.createElement("div");
    assistantContentDiv.classList.add("cmba-assistant-content");

    const textDiv = document.createElement("div");
    textDiv.classList.add("markdown-content");

    if (thinking) {
      textDiv.innerHTML = `<div class="markdown-p-text"> 正在请求中... ... </div>`;
    }

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("cmba-options");

    const copyMarkdownButtonDiv = document.createElement("div");
    copyMarkdownButtonDiv.classList.add("chat-md-bubble-options-button", "tooltip", "tooltip-top");
    copyMarkdownButtonDiv.dataset.tip = "复制文本";
    copyMarkdownButtonDiv.innerHTML = copy16;
    optionsDiv.appendChild(copyMarkdownButtonDiv);
    copyMarkdownButtonDiv.addEventListener("click", async () => {
      const index = this.findMsgIndex(mid);
      if (index < 0) {
        dsAlert({ type: "error", message: "是一个无效的消息" });
        return;
      }

      const message = store.state.messages[index];

      navigator.clipboard
        .writeText(message.content[0].text)
        .then(() => {
          dsAlert({ type: "success", message: "消息成功复制！" });
        })
        .catch((err) => {
          dsAlert({ type: "error", message: `消息复制到剪切板失败: ${err}` });
        });
    });

    const deleteButtonDiv = document.createElement("div");
    deleteButtonDiv.classList.add("chat-md-bubble-options-button", "tooltip", "tooltip-top");
    deleteButtonDiv.dataset.tip = "删除消息";
    deleteButtonDiv.innerHTML = delete16;
    optionsDiv.appendChild(deleteButtonDiv);
    deleteButtonDiv.addEventListener("click", async () => {
      this.deleteMessage(mid);
      assistantDiv.remove();
      deleteMessage(mid);
    });

    assistantContentDiv.appendChild(textDiv);
    assistantContentDiv.appendChild(optionsDiv);
    assistantDiv.appendChild(assistantIconDiv);
    assistantDiv.appendChild(assistantContentDiv);

    return textDiv;
  }

  /**
   * 插入一个思考的内容在回答的 HTML Element 的前面
   */

  insertReasoningElem(el) {
    const reasoningEl = document.createElement("div");
    const parent = el.parentNode;

    if (!parent) return null;
    parent.insertBefore(reasoningEl, el);
    reasoningEl.className = "cmba-reasoning-content";

    const detailsEl = document.createElement("details");
    detailsEl.open = true;
    reasoningEl.appendChild(detailsEl);

    const summaryEl = document.createElement("summary");
    summaryEl.innerHTML = "思考内容🤔";
    detailsEl.appendChild(summaryEl);

    const reasoningTextDiv = document.createElement("div");
    reasoningTextDiv.className = "markdown-content";
    detailsEl.appendChild(reasoningTextDiv);

    return reasoningTextDiv;
  }

  /**
   * 创建一个机器人助理的消息元素的模板
   */
  createAssTempElem(mid) {
    if (!this.container) return null;

    const assistantDiv = document.createElement("div");
    assistantDiv.id = mid;
    assistantDiv.classList.add("chat-md-bubble-assistant");

    this.container.appendChild(assistantDiv);

    const textDiv = this.createAssResponseElem(assistantDiv, mid, true);

    return textDiv;
  }

  /**
   * 在container的全部一级子元素中找到对应id是xxx的index
   */
  findMsgIndex(id) {
    if (!this.container) return -1;
    // 获取所有一级子元素
    const childrenArray = Array.from(this.container.children);
    // 查找匹配 id 的索引
    return childrenArray.findIndex((child) => child.id === id);
  }

  /**
   * 在store里删除指定mid的消息
   */

  async deleteMessage(mid) {
    const index = this.findMsgIndex(mid);

    if (index < 0) dsAlert({ type: "error", message: "是一个无效的消息" });
    else await store.dispatch("spliceMessages", index);
  }
}
