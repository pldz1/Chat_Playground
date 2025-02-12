import markdownIt from "./md-config.js";
import { buildCodeBlock, deepCloneAndUpdate } from "./code-block.js";

/** 渲染markdown的 HTML Element. */
export function renderBlock(el, data) {
  const tmpDiv = document.createElement("div");
  tmpDiv.className = "markdown-content";
  // 只渲染当前的块
  tmpDiv.innerHTML = markdownIt.render(data);
  buildCodeBlock(tmpDiv);
  // 这里不再拼接 htmlData，而是每次渲染独立的块
  deepCloneAndUpdate(el, tmpDiv);
}
