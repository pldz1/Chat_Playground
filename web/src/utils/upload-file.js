import { delete32 } from "@/assets/svg";

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

/** onLoadJsonFile 读取 json 格式的内容 */
const onLoadJsonFile = (event) => {
  return new Promise((resolve) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);
          resolve(jsonContent);
        } catch {
          resolve(null);
        }
      };
      reader.readAsText(file);
    } else {
      resolve(null);
    }
  });
};

/** handleFileUpload 是通用的处理文件上传操作的函数 */
const handleFileUpload = (acceptType, handler) => {
  return new Promise((resolve) => {
    const fileInput = document.getElementById(GlobalInputUploadEl);
    const wrappedHandler = async (event) => {
      const result = await handler(event);
      fileInput.value = "";
      fileInput.removeEventListener("change", wrappedHandler); // 清除事件监听器
      resolve(result);
    };
    fileInput.removeEventListener("change", wrappedHandler); // 防止重复绑定
    fileInput.accept = acceptType;
    fileInput.addEventListener("change", wrappedHandler);
    fileInput.click();
  });
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
  return handleFileUpload("application/json", onLoadJsonFile);
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
