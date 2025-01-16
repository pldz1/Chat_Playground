import StoreHelper from "@/store/store-helper";
import chatCardHandler from "../chat/card.js";
import { checkImageModel } from "../chat/settings.js";
import { showMessage } from "@/utils/custom-message.js";
import { uploadChatHistory } from "../../apis/chat.js";

const ImageMaxMBSize = 20;

/** handleImageFile 处理图像文件的函数 */
const handleImageFile = (file) => {
  const flag = checkImageModel();
  if (!flag) return;
  if (file) {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > ImageMaxMBSize) {
      showMessage("error", `文件太大，不能超过 ${ImageMaxMBSize} MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      chatCardHandler.displayImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

/** onLoadImageFile 操作图像从本地上传到对话框里的函数 */
const onLoadImageFile = (event) => {
  const file = event.target.files[0];
  handleImageFile(file);
};

/** loadChatByJsonFile 读取对话的历史记录文件 json 格式的内容 开始进行新的对话 */
const loadChatByJsonFile = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonContent = JSON.parse(e.target.result);
        // 读取到文本的内容
        var rea = await uploadChatHistory(jsonContent);
        if (!rea.flag) {
          showMessage("error", `SERVER解析对话文本错误 【${rea.log}】`);
          return;
        }
        // 解析成功新建对话
        chatCardHandler.drawChatHistory(rea.history);
        StoreHelper.setChatCid(rea.chatCid);
        StoreHelper.setTokens(rea.tokens);
        StoreHelper.pushChatName(rea.chatCid, "New Chat");
      } catch (error) {
        showMessage("error", `WEB读取JSON文件失败! 【${error}】`);
        return;
      }
    };
    // 将文件读取为文本
    reader.readAsText(file);
  }
};

/** handleFileUpload 是通用的处理文件上传操作的函数 */
const handleFileUpload = (acceptType, handler) => {
  const fileInput = document.getElementById("chat-file-input");
  fileInput.accept = acceptType;
  fileInput.addEventListener("change", handler);
  fileInput.click();
};

/** uploadImageFile 执行图像上传到对话输入框的函数  */
export const uploadImageFile = () => {
  handleFileUpload("image/*", onLoadImageFile);
};

/** 触发 JSON 文件上传 */
export const uploadJsonFile = () => {
  handleFileUpload("application/json", loadChatByJsonFile);
};

/** pasteImage 监听在input输入框上 粘贴图像的事件  */
export const pasteImage = () => {
  document
    .getElementById("chat-input-card")
    .addEventListener("paste", function (event) {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          handleImageFile(file);
          event.preventDefault(); // 阻止默认的粘贴行为，防止文本粘贴
          return;
        }
      }
    });
};
