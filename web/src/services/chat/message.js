/**
 * 打包用户要发送的消息
 * 主要是组合图像到要发到对话的消息里
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

/**
 *
 */
export function packMessageV1(data) {
  const messages = data.map((entry) => ({
    role: entry.role,
    content: entry.content[0].text,
  }));

  return messages;
}

export function packMessageV2(data) {
  const messages = data.map((entry) => ({
    role: entry.role,
    content: entry.content,
  }));

  return messages;
}
