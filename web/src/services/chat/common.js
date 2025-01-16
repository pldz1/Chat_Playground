import StoreHelper from "@/store/store-helper";
import {
  deleteChatAPI,
  setChatNameAPI,
  newGhostChatAPI,
  getAllHistoryAPI,
  getChatParamsAPI,
  downloadChatHistory,
  getChatModelListAPI,
} from "../../apis/chat.js";
import chatCardHandler from "./card.js";
import { showMessage, showMessageBox } from "@/utils/custom-message.js";

/** initChatPage 加载对话界面需要的基本参数 使用对话功能之前 需要做这一步的操作 */
export const initChatPage = async () => {
  // 获取能够用的全部对话模型列表
  var rea = await getChatModelListAPI();
  if (!rea.flag) {
    showMessage("error", "获取服务器的对话模型API列表失败! 🙃");
    return;
  }
  StoreHelper.setChatModelList(rea.data);

  // 获取服务器的历史对话记录
  rea = await getAllHistoryAPI();
  if (!rea.flag) {
    showMessage("error", "获取用户的对话的全部记录失败! 🙃");
    return;
  }
  StoreHelper.setChatNameList(rea.data);
  // 初始的界面 默认是空白的
  StoreHelper.setChatCid("");
  // 不为空的chatCid代表切换对话就需要更新对话的参数和历史记录
  rea = await getChatParamsAPI("");
  if (rea.flag) StoreHelper.setChatParams(rea.data);
};

/** editChatNameByCid 是根据chatCid来修改对话的名称的函数 */
export const editChatNameByCid = async (chatCid, chatName) => {
  var flag = await showMessageBox(`确定修改对话名称为 【${chatName}】 吗?`);
  // 取消 返回
  if (!flag) return;
  // 确定 调用接口修改SERVER的参数
  var rea = await setChatNameAPI(chatCid, chatName);
  if (!rea.flag) {
    showMessage("error", "服务器修改对话名称失败! 😭");
    return;
  }
  StoreHelper.editChatNameList(chatCid, chatName);
  showMessage("success", "对话名称修改成功. 😀");
};

/** deletChatByCid 用来根据chatCid来删除指定的对话
 * 这个过程需要判断被删除的对话 是不是当前真正进行的对话 */
export const deletChatByCid = async (chatCid, chatName) => {
  var flag = await showMessageBox(`确定删除【${chatName}】这个对话吗? `);
  if (!flag) return;

  var rea = await deleteChatAPI(chatCid);
  if (!rea.flag) {
    showMessage("error", `服务器删除【${chatName}】失败! 😭`);
    return;
  }

  StoreHelper.deleteChatName(chatCid);

  // 判断是不是要重置面板
  const curCid = StoreHelper.getChatCid();
  if (curCid == chatCid) {
    chatCardHandler.removeAllElem();
    StoreHelper.setTokens(0);
    StoreHelper.setChatCid("");
  }

  showMessage("success", "对话已经删除. 😀");
};

/** downloadSpecChatMsgs 把这个对话里的全部消息 保存成一个json文件 */
export const downloadSpecChatMsgs = async (chatCid) => {
  var rea = await downloadChatHistory(chatCid);
  if (!rea.flag) {
    showMessage("error", `服务器获取对话记录失败!【${rea.log}`);
    return;
  }
  // 将对象转换成JSON字符串
  const jsonData = JSON.stringify(rea.data);
  // 创建一个包含JSON字符串的Blob对象
  const jsonBlob = new Blob([jsonData], { type: "application/json" });

  // 使用URL.createObjectURL创建一个链接
  const url = URL.createObjectURL(jsonBlob);

  // 创建一个下载链接
  let downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "prompt.json"; // 指定下载文件名

  // 自动触发下载
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

/** newGhostChat 新建一个Ghost对话的辅助函数 */
export const newGhostChat = async (item) => {
  var rea = await newGhostChatAPI(item.name, item.template);
  if (!rea.flag) {
    showMessage("error", `新建一个幽灵对话失败! 【${rea.log}】 😫`);
    return;
  }

  showMessage("success", item.msg);
  StoreHelper.setChatCid(rea.chatCid);
  StoreHelper.setChatParams(rea.chatParams);
  StoreHelper.setTokens(rea.tokens);
  StoreHelper.pushChatName(rea.chatCid, item.name);
};
