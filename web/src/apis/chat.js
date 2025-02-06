import StoreHelper from "@/store/store-helper";
import { apiRequest } from "./common.js";
import { renderBlock } from "@/services/md/render.js";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { showMessage } from "@/utils/custom-message.js";

/** 📜 获取能使用的全部对话模型列表 */
export const getChatModelListAPI = () => apiRequest("get", "/chat/getChatModelList");

/** 📜 获取所有历史记录 */
export const getAllHistoryAPI = () => apiRequest("get", "/chat/allHistory");

/** ➕ 设置模型的参数 */
export const addNewChatAPI = () => apiRequest("post", "/chat/addNewChat");

/** 🛠️ 修改对话的参数,可以不是当前的对话 */
export const setChatNameAPI = (chatCid, chatName) => apiRequest("post", "/chat/setChatName", { chatCid, chatName });

/** 🛠️ 修改对话的参数,可以不是当前的对话 */
export const setChatParamsAPI = (chatCid, paramsData) => apiRequest("post", "/chat/setChatParams", { chatCid, data: paramsData });

/** 📖 获取指定对话的历史记录 */
export const getSpecChatHistoryAPI = (chatCid) => apiRequest("post", "/chat/getSpecChatHistory", { chatCid });

/** ❌ 删除对话 */
export const deleteChatAPI = (chatCid) => apiRequest("post", "/chat/deleteChat", { chatCid });

/** 📃 删除指定chatIid的对话 */
export const getChatItemAPI = (chatIid) => apiRequest("post", "/chat/getChatItem", { chatIid });

/** ❌ 删除指定chatIid的对话 */
export const deleteChatItemAPI = (chatIid) => apiRequest("post", "/chat/deleteChatItem", { chatIid });

/** ✏️ 修改指定chatIid的对话 */
export const editChatItemAPI = (chatIid, msg) => apiRequest("post", "/chat/editChatItem", { chatIid, msg });

/** ✉️ 设置用户消息 */
export const setUserMsgAPI = (msg) => apiRequest("post", "/chat/setUserMsg", { msg });

/** ⚙️ 获得当前对话的设置 */
export const getChatParamsAPI = (chatCid) => apiRequest("post", "/chat/getChatParams", { chatCid });

/** 🔄 重新生成内容 */
export const reGenerateContentAPI = (chatIid) => apiRequest("post", "/chat/reGenerateContent", { chatIid });

/** 📥 下载对话的全部消息 */
export const downloadChatHistory = (chatCid) => apiRequest("post", "/chat/downloadChatHistory", { chatCid });

/** 📤 上传json数据然后开始对话 */
export const uploadChatHistory = (jsonData) => apiRequest("post", "/chat/uploadChatHistory", { data: jsonData });

/** 👻 新建一个幽灵对话 */
export const newGhostChatAPI = (name, template) => apiRequest("post", "/chat/newGhostChat", { name, template });

/** 🔊 对话的语音播报 */
export const chatAudioAPI = (data) => apiRequest("post", "/chat/chatAudio", { data });

/** 📡 通过SSE获取来自SERVER端的响应 */
export const createEventSourceAPI = async (chatCid, assHTMLElem, ctrl) => {
  let chatRes = "";
  const textElem = assHTMLElem.querySelector(".markdown-content");

  await fetchEventSource(`/chat/sse/${chatCid}`, {
    method: "POST",
    headers: StoreHelper.getHeaders(),
    credentials: "include",
    signal: ctrl.signal,
    openWhenHidden: true,
    onmessage(event) {
      const data = JSON.parse(event.data);
      chatRes += data.data;
      StoreHelper.updateTokens(data.tokens);

      // 开始对话的标志
      if (data.flag == 1) {
        chatRes = "";
        renderBlock(textElem, "Waiting for API response... ...");
      }

      if (data.flag == 2) {
        if (!assHTMLElem.id) assHTMLElem.id = data.chatIid;
        renderBlock(textElem, chatRes);
      }

      // 服务端标志对话结束
      if (data.flag == 0) {
        renderBlock(textElem, chatRes);
        chatRes = "";
      }

      // 服务端异常强制结束
      if (data.flag == -1) {
        renderBlock(textElem, `${data.data}`);
        showMessage("error", `服务器流对话出错 ${data.data}`);
        ctrl.abort();
      }
    },
    onerror(e) {
      showMessage("error", `EventSource Error ${e}.`);
      ctrl.abort();
    },
    onclose() {
      // console.error("close");
    },
  });
};
