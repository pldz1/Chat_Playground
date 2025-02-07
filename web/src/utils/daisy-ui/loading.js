// 定义 loading 元素的 ID
const loadingElId = "custom-daisy-ui-loading";

function showdsLoading() {
  const el = document.getElementById(loadingElId);
  if (el) return;

  // 创建一个新的 div 元素来承载 loading 动画
  const loading = document.createElement("div");
  loading.className = loadingElId;
  // 设置 loading 元素的内部 HTML，使用 DaisyUI 的 loading 样式
  loading.innerHTML = `<span class="loading loading-infinity loading-lg"></span>`;

  // 将创建好的 loading 元素添加到页面的 body 中
  document.body.appendChild(loading);
}

function hiddendsLoading() {
  const el = document.querySelector(`.${loadingElId}`);
  // 如果找到了该元素，则将其从页面中移除
  if (el) {
    el.remove();
  }
}

/** 根据变量来显示/隐藏loading */
export function dsLoading(trigger) {
  if (trigger) showdsLoading();
  else hiddendsLoading();
}
