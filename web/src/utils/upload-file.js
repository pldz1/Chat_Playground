import { delete32 } from "@/assets/svg";
import { dsAlert } from "./daisy-ui-alert.js";

const GlobalInputUploadEl = "gloal-file-upload-input";
const ImageMaxMBSize = 20;

const displayImage = (base64Image) => {
  const imgContainer = document.getElementById("ccia-chat-input-imgs");
  const itemElem = document.createElement("div");
  itemElem.classList.add("ccia-item");
  itemElem.addEventListener("click", () => {
    itemElem.remove();
  });

  const imgElement = document.createElement("img");
  imgElement.classList.add("ccia-image");
  imgElement.src = base64Image;

  const hoverItem = document.createElement("div");
  hoverItem.classList.add("ccia-hover-item");

  const deleteButtonElem = document.createElement("div");
  deleteButtonElem.classList.add("ccia-hover-button");
  deleteButtonElem.innerHTML = delete32;
  hoverItem.appendChild(deleteButtonElem);

  itemElem.appendChild(hoverItem);
  itemElem.appendChild(imgElement);
  imgContainer.appendChild(itemElem);
};

/** handleImageFile 处理图像文件的函数 */
const handleImageFile = (file) => {
  const flag = true;
  if (!flag) return;
  if (file) {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > ImageMaxMBSize) {
      showMessage("error", `文件太大，不能超过 ${ImageMaxMBSize} MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      displayImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

/** onLoadImageFile 操作图像从本地上传到对话框里的函数 */
const onLoadImageFile = (event) => {
  const file = event.target.files[0];
  handleImageFile(file);
};

// /** loadChatByJsonFile 读取对话的历史记录文件 json 格式的内容 开始进行新的对话 */
// const loadChatByJsonFile = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       try {
//         const jsonContent = JSON.parse(e.target.result);
//         // 读取到文本的内容
//         var rea = await uploadChatHistory(jsonContent);
//         if (!rea.flag) {
//           showMessage("error", `SERVER解析对话文本错误 【${rea.log}】`);
//           return;
//         }
//         // 解析成功新建对话
//         chatCardHandler.drawChatHistory(rea.history);
//         StoreHelper.setChatCid(rea.chatCid);
//         StoreHelper.setTokens(rea.tokens);
//         StoreHelper.pushChatName(rea.chatCid, "New Chat");
//       } catch (error) {
//         showMessage("error", `WEB读取JSON文件失败! 【${error}】`);
//         return;
//       }
//     };
//     // 将文件读取为文本
//     reader.readAsText(file);
//   }
// };

/** handleFileUpload 是通用的处理文件上传操作的函数 */
const handleFileUpload = (acceptType, handler) => {
  const fileInput = document.getElementById(GlobalInputUploadEl);
  fileInput.removeEventListener("change", handler);
  fileInput.accept = acceptType;
  fileInput.addEventListener("change", (event) => {
    handler(event);
    fileInput.value = "";
  });
  fileInput.click();
};

/** 实际上处理粘贴行为的函数 */
const handlePasted = (event) => {
  const items = event.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
      const file = items[i].getAsFile();
      handleImageFile(file);
      event.preventDefault();
      // 阻止默认的粘贴行为，防止文本粘贴
      return;
    }
  }
};

/** uploadImageFile 执行图像上传到对话输入框的函数  */
export const uploadImageFile = () => {
  handleFileUpload("image/*", onLoadImageFile);
};

/** 触发 JSON 文件上传 */
export const uploadJsonFile = () => {
  handleFileUpload("application/json", loadChatByJsonFile);
};

/** pasteImage 监听在某个 DOM 上的粘贴事件  */
export const addPasteEvent = (domId) => {
  document.getElementById(domId).addEventListener("paste", function (event) {
    handlePasted(event);
  });
};

/** 移除在某个 DOM 上的粘贴事件  */
export const removePasetEvent = (domId) => {
  document.getElementById(domId).removeEventListener("paste", function (event) {
    handlePasted(event);
  });
};
