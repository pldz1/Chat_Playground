/**
 * 防抖函数 (Debounce)
 * @param {Function} fn - 需要防抖处理的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} [immediate=false] - 是否立即执行第一次
 * @returns {Function} - 包装后的防抖函数
 * @example
 * const debouncedFn = debounce(() => console.log('Resized'), 300);
 * window.addEventListener('resize', debouncedFn);
 */
export function debounce(fn, delay, immediate = false) {
  let timer;
  return function (...args) {
    if (immediate && !timer) {
      // 立即执行一次
      fn.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!immediate) fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 节流函数 (Throttle)
 * @param {Function} fn - 需要节流处理的函数
 * @param {number} [interval=300] - 执行间隔（毫秒）
 * @returns {Function} - 包装后的节流函数
 * @example
 * const throttledScroll = throttle(() => console.log('Scrolling'), 200);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
