const copyToClipboard = (button) => {
  const codeBlock = button
    .closest(".copy-header")
    .nextElementSibling.querySelector("code").innerText;

  navigator.clipboard
    .writeText(codeBlock)
    .then(() => {
      const copyText = button.querySelector(".copy-text");
      copyText.innerText = "Copied!";

      // 一段时间后恢复原来的文本
      setTimeout(() => {
        copyText.innerText = "Copy code";
      }, 2000); // 2秒后恢复
    })
    .catch((err) => {
      console.error("复制失败:", err);
    });
};

window.copyToClipboard = copyToClipboard;
