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
