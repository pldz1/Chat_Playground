// 复制内容到剪贴板
export async function copyToClipboard(imgElement) {
  // 创建一个 canvas 元素，并设置宽高与图像一致
  const canvas = document.createElement("canvas");
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  const ctx = canvas.getContext("2d");

  // 将图像绘制到 canvas 上
  ctx.drawImage(imgElement, 0, 0);

  // 将 canvas 内容转换为 Blob，并包装成 Promise
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) {
    return false;
  }

  try {
    // 创建 ClipboardItem 对象，并写入剪贴板
    const clipboardItem = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    console.error("复制到剪贴板失败：", error);
    return false;
  }
}

// 保存内容到本地
export async function saveToLocal(imgElement, filename = "image.png") {
  // 创建一个 canvas 元素，并设置宽高与图像一致
  const canvas = document.createElement("canvas");
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  const ctx = canvas.getContext("2d");

  // 将图像绘制到 canvas 上
  ctx.drawImage(imgElement, 0, 0);

  // 将 canvas 内容转换为 Blob，并包装成 Promise
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) {
    return false;
  }

  try {
    // 创建一个 URL 对象指向 Blob 数据
    const url = URL.createObjectURL(blob);
    // 创建一个隐藏的下载链接
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // 模拟点击下载链接
    document.body.appendChild(link);
    link.click();

    // 清理操作
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("保存到本地失败：", error);
    return false;
  }
}
