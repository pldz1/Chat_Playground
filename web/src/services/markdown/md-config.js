import MarkdownIt from "markdown-it";
import emoji from "markdown-it-emoji";
import deflist from "markdown-it-deflist";
import footnote from "markdown-it-footnote";
import ins from "markdown-it-ins";
import mark from "markdown-it-mark";
import taskLists from "markdown-it-task-lists";
import container from "markdown-it-container";
import toc from "markdown-it-toc-done-right";
import mermaid from "@DatatracCorporation/markdown-it-mermaid";

/**
 * 对渲染出来的link额外处理
 */
function addTargetBlankToLinks(markdownIt) {
  const defaultRender =
    markdownIt.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // 为所有链接添加 target="_blank"
    const aIndex = tokens[idx].attrIndex("target");
    if (aIndex < 0) {
      // 添加新的属性
      tokens[idx].attrPush(["target", "_blank"]);
    } else {
      // 修改已有的属性
      tokens[idx].attrs[aIndex][1] = "_blank";
    }
    return defaultRender(tokens, idx, options, env, self);
  };
}

var config = {
  html: true,
  xhtmlOut: true,
  breaks: true,
  langPrefix: "lang-",
  linkify: false,
  typographer: true,
  quotes: "“”‘’",
};

let markdownIt = new MarkdownIt(config);

markdownIt
  .use(emoji)
  .use(deflist)
  .use(footnote)
  .use(ins)
  .use(mark)
  .use(taskLists)
  .use(container)
  .use(container, "hljs-left")
  .use(container, "hljs-center")
  .use(container, "hljs-right")
  .use(toc)
  .use(mermaid);

addTargetBlankToLinks(markdownIt);

export default markdownIt;
