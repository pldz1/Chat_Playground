import { dsAlert, getUuid, textToHtml } from "@/utils";
import { delete16, edit16, circle16 } from "@/assets/svg";

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

export class ChatDrawer {
  constructor(updateStore = false) {
    this.id = "";
    this.container = null;
    this.updateStore = updateStore;
  }

  init(id) {
    this.id = id;
    this.container = document.getElementById(this.id);
  }

  /**
   * 绘制对话的气泡卡片.
   * @param {Prompt[]} messages 是一个符合 v2 版本的对话数据结构
   */
  draw(messages) {
    for (let index = 0; index < messages.length; index++) {
      const msg = messages[index];
      const data = { ...msg, mid: getUuid() };

      if (data.role == "user") {
        this._addUserQHTMLElem(data.mid, data.content);
      }
    }
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
   * @param {str} mid HTMLElement 的 id
   * @param {PromptContent[]} content 消息的内容
   * @returns
   */
  _addUserQHTMLElem = (mid, content) => {
    debugger;
    if (!this.container) return;
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.id = mid;

    const userContentDiv = document.createElement("div");
    userContentDiv.classList.add("user-content");

    const contentAreaDiv = document.createElement("div");
    contentAreaDiv.classList.add("content-area");

    const imgAreaElem = document.createElement("div");
    imgAreaElem.classList.add("img-area");
    const textDiv = document.createElement("div");
    textDiv.classList.add("markdown-content");

    content.forEach((prompt) => {
      if (prompt.type == "text") {
        textDiv.innerHTML = textToHtml(prompt.text);
      }

      if (prompt.type == "image_url") {
        const imgItem = document.createElement("img");
        imgItem.classList.add("item");
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
    optionsDiv.classList.add("options");

    const reGenerateButtonDiv = document.createElement("div");
    reGenerateButtonDiv.classList.add("options-button");
    reGenerateButtonDiv.innerHTML = circle16;
    optionsDiv.appendChild(reGenerateButtonDiv);

    reGenerateButtonDiv.addEventListener("click", async () => {
      dsAlert({ type: "info", message: "在补齐了" });
    });

    const editButtonDiv = document.createElement("div");
    editButtonDiv.classList.add("options-button");
    editButtonDiv.innerHTML = edit16;
    optionsDiv.appendChild(editButtonDiv);

    editButtonDiv.addEventListener("click", async () => {
      dsAlert({ type: "info", message: "在补齐了" });
    });

    const deleteButtonDiv = document.createElement("div");
    deleteButtonDiv.classList.add("options-button");
    deleteButtonDiv.innerHTML = delete16;
    optionsDiv.appendChild(deleteButtonDiv);

    deleteButtonDiv.addEventListener("click", async () => {
      dsAlert({ type: "info", message: "在补齐了" });
    });

    userContentDiv.appendChild(optionsDiv);
    userDiv.appendChild(userContentDiv);
    this.container.appendChild(userDiv);
  };

  _addAssHTMLElem = (chatIid, text) => {
    if (!this._init()) return;
    const assistantDiv = document.createElement("div");
    assistantDiv.classList.add("assistant");
    //  注意 这里只是把从历史记录拿的消息和从SSE拿的逻辑统一了一下 存在这个判断条件
    if (chatIid !== "") {
      assistantDiv.id = chatIid;
    }

    const assistantIconDiv = document.createElement("div");
    assistantIconDiv.classList.add("assistant-icon");
    assistantIconDiv.innerHTML = assistantIcon;

    const assistantContentDiv = document.createElement("div");
    assistantContentDiv.classList.add("assistant-content");

    const textDiv = document.createElement("div");
    textDiv.classList.add("markdown-content");
    if (chatIid !== "") {
      renderBlock(textDiv, text);
    } else {
      textDiv.innerHTML = text;
      textDiv.classList.add("markdown-p-text");
    }

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    const copyMarkdownButtonDiv = document.createElement("div");
    copyMarkdownButtonDiv.classList.add("options-button");
    copyMarkdownButtonDiv.innerHTML = copyMarkdownIcon;
    optionsDiv.appendChild(copyMarkdownButtonDiv);
    copyMarkdownButtonDiv.addEventListener("click", async () => {
      await ChatOptions.copyChatItem(assistantDiv.id);
    });

    const deleteButtonDiv = document.createElement("div");
    deleteButtonDiv.classList.add("options-button");
    deleteButtonDiv.innerHTML = delete16;
    optionsDiv.appendChild(deleteButtonDiv);
    deleteButtonDiv.addEventListener("click", async () => {
      await ChatOptions.deleteChatItem(assistantDiv.id);
    });

    assistantContentDiv.appendChild(textDiv);
    assistantContentDiv.appendChild(optionsDiv);
    assistantDiv.appendChild(assistantIconDiv);
    assistantDiv.appendChild(assistantContentDiv);
    this._chatContainer.appendChild(assistantDiv);

    return assistantDiv;
  };
}

export default ChatDrawer;
