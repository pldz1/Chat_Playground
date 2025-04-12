export function* yieldContent(codeContent) {
  console.error("codeContent: ", codeContent);
  let i = 0;
  while (i < codeContent.length) {
    // 随机生成 1 到 20 之间的数
    const chunkSize = Math.floor(Math.random() * 20) + 1;
    // 获取一个片段
    const chunk = codeContent.slice(i, i + chunkSize);
    yield chunk; // 一次性返回这部分字符
    i += chunkSize; // 更新索引，跳过已经返回的字符
    // 休眠 20ms
    yield new Promise((resolve) => setTimeout(resolve, 20));
  }
}
