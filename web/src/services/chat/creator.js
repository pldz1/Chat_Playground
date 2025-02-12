import { dsAlert, textToHtml } from "@/utils";
import { renderBlock } from "../markdown/md-render.js";
import { delete16, edit16, circle16, app18, copy16 } from "@/assets/svg";

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
 *
 * @param {str} mid HTMLElement 的 id
 * @param {PromptContent[]} content 消息的内容
 * @returns
 */
export function createUserQHTMLElem(container, content, mid) {
  if (!container) return null;
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
    dsAlert({ type: "info", message: "在补齐了" });
  });

  userContentDiv.appendChild(optionsDiv);
  userDiv.appendChild(userContentDiv);
  container.appendChild(userDiv);

  return userDiv;
}

/**
 *
 * @param {str} mid HTMLElement 的 id
 * @param {PromptContent[]} content 消息的内容
 * @returns
 */
export function createAssHTMLElem(container, content, mid) {
  if (!container) return null;

  const assistantDiv = document.createElement("div");
  assistantDiv.id = mid;
  assistantDiv.classList.add("chat-md-bubble-assistant");

  container.appendChild(assistantDiv);

  const textDiv = createAssThinkingElem(assistantDiv, mid, false);
  const text = content[0].text;
  renderBlock(textDiv, text);

  return assistantDiv;
}

/**
 * 创建一个助理机器人正在思考的 HTMLElement
 */
export function createAssThinkingElem(assistantDiv, mid, thinking = false) {
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
  copyMarkdownButtonDiv.addEventListener("click", async () => {});

  const deleteButtonDiv = document.createElement("div");
  deleteButtonDiv.classList.add("chat-md-bubble-options-button", "tooltip", "tooltip-top");
  deleteButtonDiv.dataset.tip = "删除消息";
  deleteButtonDiv.innerHTML = delete16;
  optionsDiv.appendChild(deleteButtonDiv);
  deleteButtonDiv.addEventListener("click", async () => {});

  assistantContentDiv.appendChild(textDiv);
  assistantContentDiv.appendChild(optionsDiv);
  assistantDiv.appendChild(assistantIconDiv);
  assistantDiv.appendChild(assistantContentDiv);

  return textDiv;
}

/**
 * 创建一个机器人助理的消息元素的模板
 */
export function createAssTempElem(container, mid) {
  if (!container) return null;

  const assistantDiv = document.createElement("div");
  assistantDiv.id = mid;
  assistantDiv.classList.add("chat-md-bubble-assistant");

  container.appendChild(assistantDiv);

  const textDiv = createAssThinkingElem(assistantDiv, mid, true);

  return textDiv;
}
