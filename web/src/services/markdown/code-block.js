import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import vbscript from "highlight.js/lib/languages/vbscript";
import python from "highlight.js/lib/languages/python";
import matlab from "highlight.js/lib/languages/matlab";
import csharp from "highlight.js/lib/languages/csharp";
import shell from "highlight.js/lib/languages/shell";
import vhdl from "highlight.js/lib/languages/vhdl";
import java from "highlight.js/lib/languages/java";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import sql from "highlight.js/lib/languages/sql";
import cpp from "highlight.js/lib/languages/cpp";
import c from "highlight.js/lib/languages/c";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("vbscript", vbscript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("matlab", matlab);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("vhdl", vhdl);
hljs.registerLanguage("java", java);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("c", c);

hljs.configure({ ignoreUnescapedHTML: true });

const rootMdDivClassName = "markdown-content";

/**
 * 高亮代码块
 * @param {Element} element 包含 pre code 代码块的元素
 */
function highlightCode(element) {
  const codeEls = element.querySelectorAll("pre code");
  codeEls.forEach((el) => {
    hljs.highlightElement(el);
  });
}

// 全局函数
window.copyHandler = function (e) {
  const btn = e.target;
  const codeElement = btn.closest(".markdown-content-copy").nextElementSibling;
  if (codeElement?.tagName.toLowerCase() === "code") {
    // 代码的文本
    const codeText = codeElement.textContent;
    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        btn.textContent = "已复制!";

        // 一段时间后恢复原来的文本
        setTimeout(() => {
          btn.textContent = "复制";
        }, 2000); // 2秒后恢复
      })
      .catch((err) => {
        console.error("复制失败:", err);
      });
  } else {
    console.error("未找到 <code> 元素");
  }
};

/**
 * 给代码块添加复制按钮
 * @param {Element} element 包含 pre 和 code 代码块的元素
 */
function buildCopyButton(element) {
  const pres = element.querySelectorAll("pre");
  if (!pres.length) return;

  pres.forEach((pre) => {
    const codeElem = pre.querySelector("code");
    if (!codeElem) return;

    // 创建按钮
    const btn = document.createElement("span");
    btn.id = String(Math.random());
    btn.className = "markdown-content-copy";
    btn.textContent = "复制";

    // 设置内联点击事件
    btn.setAttribute("onclick", "copyHandler(event)");

    // 将按钮添加到 pre 元素开头
    pre.insertBefore(btn, pre.firstChild);
  });
}

/** 构建生成中的 markdown 的内容 */
export function buildCodeBlock(element) {
  highlightCode(element);
  buildCopyButton(element);
}

/** 核心函数, 对比节点的内容 实现动态更新 markdown 的 div 而不是用 innerHTML 的属性全部刷新 */
export function deepCloneAndUpdate(div1, div2) {
  if (div2.innerHTML == "") return;
  // 递归比较和更新 div1 和 div2 的子节点
  function compareAndUpdate(node1, node2) {
    // 情况 1：node1 是文本节点，更新文本内容
    if (node1 && node1.nodeType === Node.TEXT_NODE && node2.nodeType === Node.TEXT_NODE) {
      if (node1.nodeValue !== node2.nodeValue) {
        // 更新文本内容
        node1.nodeValue = node2.nodeValue;
      }
      return;
    }

    // 情况 2：node1 和 node2 的标签名不同，替换整个节点
    if (!node1 || node1.tagName !== node2.tagName) {
      // 克隆 node2 节点
      const newNode = node2.cloneNode(true);
      if (node1) {
        // 替换旧节点
        node1.parentNode.replaceChild(newNode, node1);
      } else {
        // 如果 node1 不存在，直接新增
        node2.parentNode.appendChild(newNode);
      }
      return;
    }

    // 情况 3：节点的 class 或其他属性更新, 注意对root节点的保护
    if (node1.className !== rootMdDivClassName && node1.className !== node2.className) {
      // 3.1 更新 className
      node1.className = node2.className;
    }

    // 3.2 对 id 的更新 注意对root节点的保护
    if (node1.id !== rootMdDivClassName && node1.id !== node2.id) {
      node1.id = node2.id;
    }

    //  3.3 对 style 的更新
    if (node1.style.cssText !== node2.style.cssText) {
      node1.style.cssText = node2.style.cssText;
    }

    // 情况 4：递归对比和更新子节点
    const children1 = Array.from(node1.childNodes); // node1 的所有子节点
    const children2 = Array.from(node2.childNodes); // node2 的所有子节点

    // 遍历 node2 的子节点，逐个与 node1 的对应子节点比较
    children2.forEach((child2, index) => {
      const child1 = children1[index];
      if (!child1) {
        // 如果 child1 不存在，直接克隆 child2 并添加到 node1
        const newChild = child2.cloneNode(true);
        node1.appendChild(newChild);
      } else {
        // 如果 child1 存在，递归比较和更新
        compareAndUpdate(child1, child2);
      }
    });

    // 删除 node1 中多余的子节点
    if (children1.length > children2.length) {
      for (let i = children2.length; i < children1.length; i++) {
        node1.removeChild(children1[i]);
      }
    }
  }

  // 从 div2 根节点开始与 div1 比较
  compareAndUpdate(div1, div2);
}

/** 渲染markdown的 HTML Element. */
export function renderBlock(className, el, data) {
  const tmpDiv = document.createElement("div");
  tmpDiv.className = className;
  // 只渲染当前的块
  tmpDiv.innerHTML = markdownIt.render(data);
  buildCodeBlock(tmpDiv);
  // 这里不再拼接 htmlData，而是每次渲染独立的块
  deepCloneAndUpdate(el, tmpDiv);
}
