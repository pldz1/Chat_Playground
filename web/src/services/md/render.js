import markdownIt from "@/utils/markdown-config";
import { buildCodeBlock, deepCloneAndUpdate } from "@/utils/code-block";

/** 渲染markdown的 HTML Element. */
function renderBlock(el, data) {
  const tmpDiv = document.createElement("div");
  // 只渲染当前的块
  tmpDiv.innerHTML = markdownIt.render(data);
  buildCodeBlock(tmpDiv);
  // 这里不再拼接 htmlData，而是每次渲染独立的块
  deepCloneAndUpdate(el, tmpDiv);
}

function textToHtml(strData) {
  // 用一个不存在的样式来替换换行 保证来回的切换
  return strData
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, '<br class="__NEW__LINE__"/>');
}

export { renderBlock, textToHtml };
