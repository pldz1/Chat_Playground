import ChatOptions from "./options.js";
import StoreHelper from "@/store/store-helper";
import { renderBlock, textToHtml } from "@/services/md/render.js";
import { assistantIcon, reRequestIcon, eidtChatItemIcon, copyMarkdownIcon, deleteChatItemIcon, chatDeleteImgIcon } from "@/assets/image/chat-svgs.js";
import { createEventSourceAPI } from "../../apis/chat.js";

class ChatItemHelper {
  constructor() {
    this._chatContainer = this._init();
    /** @type {AbortController} */
    this.ctrl = null;
  }

  _init() {
    if (!this._chatContainer) {
      this._chatContainer = document.getElementById("chat-messages-container");
    }
    return this._chatContainer;
  }

  /** 删除容器下的全部div */
  removeAllElem() {
    const divs = this._chatContainer.getElementsByTagName("div");
    while (divs.length > 0) {
      divs[0].remove();
    }
  }

  _addUserQHTMLElem = (chatIid, contentList) => {
    if (!this._init()) return;
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.id = chatIid;

    const userContentDiv = document.createElement("div");
    userContentDiv.classList.add("user-content");

    const contentAreaDiv = document.createElement("div");
    contentAreaDiv.classList.add("content-area");

    const imgAreaElem = document.createElement("div");
    imgAreaElem.classList.add("img-area");
    const textDiv = document.createElement("div");
    textDiv.classList.add("markdown-content");

    contentList.forEach((content) => {
      if (content.type == "text") {
        textDiv.innerHTML = textToHtml(content.text);
      }

      if (content.type == "image_url") {
        const imgItem = document.createElement("img");
        imgItem.classList.add("item");
        imgItem.src = content.image_url.url;
        imgAreaElem.appendChild(imgItem);
      }
    });

    const hasImgContent = contentList.some((obj) => obj.type === "image_url");
    if (hasImgContent) {
      contentAreaDiv.appendChild(imgAreaElem);
    }

    contentAreaDiv.appendChild(textDiv);
    userContentDiv.appendChild(contentAreaDiv);

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    const reGenerateButtonDiv = document.createElement("div");
    reGenerateButtonDiv.classList.add("options-button");
    reGenerateButtonDiv.innerHTML = reRequestIcon;
    optionsDiv.appendChild(reGenerateButtonDiv);

    reGenerateButtonDiv.addEventListener("click", async () => {
      const flag = await ChatOptions.reGenerateMessage(userDiv.id);
      if (!flag) return;
      // 重新开始生成Assistant的内容
      const chatCid = StoreHelper.getChatCid();
      this._getAssistantResponse(chatCid);
    });

    const editButtonDiv = document.createElement("div");
    editButtonDiv.classList.add("options-button");
    editButtonDiv.innerHTML = eidtChatItemIcon;
    optionsDiv.appendChild(editButtonDiv);

    editButtonDiv.addEventListener("click", async () => {
      await ChatOptions.editChatItem(userDiv.id);
    });

    const deleteButtonDiv = document.createElement("div");
    deleteButtonDiv.classList.add("options-button");
    deleteButtonDiv.innerHTML = deleteChatItemIcon;
    optionsDiv.appendChild(deleteButtonDiv);

    deleteButtonDiv.addEventListener("click", async () => {
      await ChatOptions.deleteChatItem(userDiv.id);
    });

    userContentDiv.appendChild(optionsDiv);
    userDiv.appendChild(userContentDiv);
    this._chatContainer.appendChild(userDiv);
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
    deleteButtonDiv.innerHTML = deleteChatItemIcon;
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

  /** 监听剪切板的内容 开始做图像的粘贴 */
  displayImage = (base64Image) => {
    const imgContainer = document.getElementById("ccia-chat-input-imgs");
    const itemElem = document.createElement("div");
    itemElem.classList.add("ccia-item");
    itemElem.addEventListener("click", () => {
      itemElem.remove();
    });

    const imgElement = document.createElement("img");
    imgElement.classList.add("ccia-image");
    imgElement.src = base64Image;

    const hoverItem = document.createElement("div");
    hoverItem.classList.add("ccia-hover-item");

    const deleteButtonElem = document.createElement("div");
    deleteButtonElem.classList.add("ccia-hover-button");
    deleteButtonElem.innerHTML = chatDeleteImgIcon;
    hoverItem.appendChild(deleteButtonElem);

    itemElem.appendChild(hoverItem);
    itemElem.appendChild(imgElement);
    imgContainer.appendChild(itemElem);
  };

  /** 判断当前的对话历史里面 是不是包含了图像 */
  checkImgsExit() {
    if (!this._init()) return false;
    const imgElem = this._chatContainer.querySelector("img");
    return imgElem ? true : false;
  }

  /** ⭐⭐⭐ _getAssistantResponse 是根据用户返回*/
  async _getAssistantResponse(chatCid, callback) {
    // 从服务端获得输出,并创建一个HTMLElement来缓存值
    const assHTMLElem = this._addAssHTMLElem("", "Connect to WEB server... ...");

    if (callback) await callback();
    this.ctrl = new AbortController();
    await createEventSourceAPI(chatCid, assHTMLElem, this.ctrl);
  }
}

export default ChatItemHelper;
