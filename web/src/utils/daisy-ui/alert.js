import { infoIcon, successIcon, warnIcon, errorIcon } from "@/assets/image/global-svgs.js";

// 默认的 svg 图标
const defaultIcons = {
  success: successIcon,
  error: errorIcon,
  info: infoIcon,
  warn: warnIcon,
};

// 默认的 Bootstrap alert 样式类
const defaultClasses = {
  success: "alert alert-success custom-daisy-ui-alert",
  error: "alert alert-error custom-daisy-ui-alert",
  info: "alert alert-info custom-daisy-ui-alert",
  warn: "alert alert-warning custom-daisy-ui-alert",
};

/**
 * 显示一个 alert 提示框
 *
 * @param {Object} options 配置选项
 * @param {('warn'|'info'|'success'|'error')} [options.type='info'] 提示类型，默认 info
 * @param {string} [options.message=''] 提示文本内容
 * @param {string} [options.icon=''] 自定义图标（SVG 字符串），如果为空则使用默认图标
 * @param {number} [options.duration=3000] 显示持续时间（单位：毫秒）
 * @param {HTMLElement} [options.container=null] 挂载的容器元素
 */
export function dsAlert({ type = "info", message = "", icon = "", duration = 3000, container = null } = {}) {
  // 如果用户没有自定义 icon，则使用默认 icon
  const iconHTML = icon || defaultIcons[type] || "";

  // 创建 alert 元素（不需要额外的容器）
  const alertEl = document.createElement("div");
  alertEl.setAttribute("role", "alert");
  alertEl.className = defaultClasses[type] || defaultClasses.info;
  alertEl.innerHTML = `${iconHTML}<span>${message}</span>`;

  // 挂载到指定的容器上（默认是 body)
  if (!container) {
    document.body.appendChild(alertEl);
  } else {
    container.appendChild(alertEl);
  }

  // 指定时间后自动移除该 alert 元素
  setTimeout(() => {
    alertEl.remove();
  }, duration);
}
