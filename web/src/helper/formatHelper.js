// 引入依赖
import MarkdownIt from "markdown-it";
import hljs from "highlight.js/lib/core";

// 引入需要的相关语言包
import cpp from "highlight.js/lib/languages/cpp";
import c from "highlight.js/lib/languages/c";
import python from "highlight.js/lib/languages/python";
import accesslog from "highlight.js/lib/languages/accesslog";
import bash from "highlight.js/lib/languages/bash";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import javascript from "highlight.js/lib/languages/javascript";
import handlebars from "highlight.js/lib/languages/handlebars";
import java from "highlight.js/lib/languages/java";
import json from "highlight.js/lib/languages/json";
import nginx from "highlight.js/lib/languages/nginx";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

import * as SVGS from "../assets/styles/chat/svgs.js";

// 语言包需要注册
hljs.registerLanguage("accesslog", accesslog);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("nginx", nginx);
hljs.registerLanguage("handlebars", handlebars);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("c", c);
hljs.registerLanguage("python", python);

const marked = new MarkdownIt({
  highlight: function (str, lang) {
    let codeContent = "";

    try {
      if (lang && hljs.getLanguage(lang)) {
        codeContent = hljs.highlight(str, { language: lang }).value;
      } else {
        codeContent = hljs.highlight(str, { language: "python" }).value;
      }
    } catch (__) {
      codeContent = hljs.highlight(str, { language: "python" }).value;
    }

    return `
      <div class="text code-block">
        <div class="copy-header">
          <div class="lang">${lang ? lang : "plaintext"}</div>
          <button class="copy-button" onclick="copyToClipboard(this)">
            ${SVGS.copyCodeIcon}
            <div class="copy-text">Copy code</div>
          </button>
        </div> 
        <pre class="text code-block hljs"><code>${codeContent}</code></pre>
      </div> 
    `;
  },
});

marked.use((md) => {
  const defaultRender =
    md.renderer.rules.fence ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    // const token = tokens[idx];
    // const info = token.info ? md.utils.unescapeAll(token.info).trim() : "";
    // const langName = info.split(/\s+/g)[0];
    options.langPrefix = "code-language-";
    return `
      <div class="text code-rendered">
        ${defaultRender(tokens, idx, options, env, self)}
      </div> 
      `;
  };
});

const textToHtml = (strData) => {
  // 用一个不存在的样式来替换换行 保证来回的切换
  return strData
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, '<br class="__NEW__LINE__"/>');
};

export { marked, textToHtml };
