/** 处理来自 SERVER 返回的对话消息的函数 */

/**
 * 从这个版本开始 会支持 理解图形的对话消息格式 个人觉得这个是个趋势
 * 官网介绍 gpt-x 模型只具备理解图形的能力 只有 dall-e 模型 才具备生成模型的能力
 * 目前能够理解对话包括图形的模型 只有 gpt-4o, gpt-4o-mini, gpt-4-turbo
 * 具体的介绍参考 可以查看 https://platform.openai.com/docs/guides/vision
 */

/**
 * 获取SERVER 直接返回的 的数据中 得到具体的 text 内容和 image的内容
 * @param {object} message: 一条消息的数据结构 形如: {role:'system', content:[{type:'text',text:'xxx'}]}
 * */
export function getContent(message) {
  const jMessage = typeof message == "string" ? JSON.parse(message) : message;
  const res = { texts: "", images: [] };

  // 无效结果 返回空 并且控制台警告, 实际上这个情况 如果前后端约定好了 是极小可能出现的
  if (!Array.isArray(jMessage.content)) {
    console.warn("Get invalid message: ", message);
    return res;
  }

  jMessage.content.forEach((cont) => {
    if (cont.type == "text") res.texts += cont.text;
    if (cont.type == "image_url") res.images.push(cont.image_url.url);
  });

  return res;
}

/** 打包用户要发送的纯文本的消息格式 */
export function getUserTextMsg(texts) {
  return {
    role: "user",
    content: [{ type: "text", text: texts }],
  };
}

/**
 * 打包用户要发送的消息
 *  */
export function packUserMsg(id, texts) {
  const res = { role: "user", content: [{ type: "text", text: texts }] };
  const imgContainer = document.getElementById(id);
  if (imgContainer) {
    const imgs = imgContainer.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
      res.content.push({
        type: "image_url",
        image_url: { url: imgs[i].getAttribute("src"), detail: "low" },
      });
    }
    imgContainer.innerHTML = "";
  }
  return res;
}
