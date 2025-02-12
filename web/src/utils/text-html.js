export function textToHtml(strData) {
  // 用一个不存在的样式来替换换行 保证来回的切换
  return strData.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br class="__NEW__LINE__"/>');
}
