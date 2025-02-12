import { info24, success24, warn24, error24 } from "@/assets/svg";

// 默认的 svg 图标
const defaultIcons = {
  success: success24,
  error: error24,
  info: info24,
  warn: warn24,
};

// 默认的 Bootstrap alert 样式类
const defaultClasses = {
  success: "alert alert-success",
  error: "alert alert-error",
  info: "alert alert-info",
  warn: "alert alert-warning",
};

/**
 * 显示一个 alert 提示框
 *
 * @param {Object} options 配置选项
 * @param {('warn'|'info'|'success'|'error')} [options.type='info'] 提示类型，默认 info
 * @param {string} [options.message=''] 提示文本内容
 * @param {string} [options.icon=''] 自定义图标（SVG 字符串），如果为空则使用默认图标
 * @param {number} [options.duration=1500] 显示持续时间（单位：毫秒）
 * @param {HTMLElement} [options.container=null] 挂载的容器元素
 */
export function dsAlert({ type = "info", message = "", icon = "", duration = 1500, container = null } = {}) {
  // 如果用户没有自定义 icon，则使用默认 icon
  const iconHTML = icon || defaultIcons[type] || "";

  let alertContainer = document.getElementById("custom-daisy-ui-alert");
  if (!alertContainer) {
    alertContainer = document.createElement("div");
    alertContainer.id = "custom-daisy-ui-alert";
    alertContainer.className = "custom-daisy-ui-alert";
  }

  // 创建 alert 元素（不需要额外的容器）
  const alertEl = document.createElement("div");
  alertEl.setAttribute("role", "alert");
  alertEl.className = defaultClasses[type] || defaultClasses.info;
  alertEl.innerHTML = `${iconHTML}<span>${message}</span>`;

  // 放到容器内
  alertContainer.appendChild(alertEl);

  // 挂载到指定的容器上（默认是 body)
  if (!container) {
    document.body.appendChild(alertContainer);
  } else {
    container.appendChild(alertContainer);
  }

  // 指定时间后自动移除该 alert 元素
  setTimeout(() => {
    alertEl.remove();
  }, duration);
}
