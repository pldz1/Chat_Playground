import store from "@/store";
import { apiRequest, dsAlert, isValidChatInfoArray, getUuid, generateRandomCname } from "@/utils";

/**
 * 对话列表元素类型
 * @typedef {Object} ChatInfo
 * @property {string} cid - 对话的id
 * @property {string} cname - 对话的名称
 */

/**
 * 获取全部的对话列表
 * @return {Promise<{ flag: boolean, log: string, data:ChatInfo[] }>} 服务器返回的结果
 */
export const getChatListAPI = (username) => apiRequest("post", "/api/v1/chat/getChatList", { username });

/**
 * 获取对话的模型设置参数
 * @return {Promise<{ flag: boolean, log: string, data:string }>} 服务器返回的结果
 */
export const getChatSettingsAPI = (username, cid) => apiRequest("post", "/api/v1/chat/getChatSettings", { username, cid });

/**
 * 设置对话的模型设置参数
 * @return {Promise<{ flag: boolean, log: string }>} 服务器返回的结果
 */
export const setChatSettingsAPI = (username, cid, data) => apiRequest("post", "/api/v1/chat/setChatSettings", { username, cid, data });

/**
 * 新增对话请求
 * @return {Promise<{ flag: boolean, log: string }>} 服务器返回的结果
 */
export const addChatAPI = (username, cid, cname) => apiRequest("post", "/api/v1/chat/addChat", { username, cid, cname });

/**
 * 删除对话
 * @return {Promise<{ flag: boolean, log: string }>} 服务器返回的结果
 */
export const deleteChatAPI = (username, cid) => apiRequest("post", "/api/v1/chat/deleteChat", { username, cid });

/**
 * 重命名对话
 * @return {Promise<{ flag: boolean, log: string }>} 服务器返回的结果
 */
export const renameChatAPI = (username, cid, cname) => apiRequest("post", "/api/v1/chat/renameChat", { username, cid, cname });

/**
 * 获得全部消息内容
 * @return {Promise<{ flag: boolean, log: string, data: any[]}>} 服务器返回的结果
 */
export const getAllMessageAPI = (username, cid) => apiRequest("post", "/api/v1/chat/getAllMessage", { username, cid });

/**
 * 新增消息
 * @return {Promise<{ flag: boolean, log: string }>} 服务器返回的结果
 */
export const addMessageAPI = (username, cid, mid, message) => apiRequest("post", "/api/v1/chat/addMessage", { username, cid, mid, message });

/**
 * 删除对话
 * @return {Promise<{ flag: boolean, log: string }>} 服务器返回的结果
 */
export const deleteMessageAPI = (username, cid, mid) => apiRequest("post", "/api/v1/chat/deleteMessage", { username, cid, mid });

/**
 * 获得全部对话历史
 */
export async function getChatList() {
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;
  if (!isLoggedIn || !username) return false;

  const res = await getChatListAPI(username);
  if (!res.flag) {
    await store.dispatch("resetChatList", []);
    dsAlert({ type: "error", message: `Get chat list failed: ${res.log}` });
    return false;
  } else {
    const isValidData = isValidChatInfoArray(res.data);
    if (isValidData) {
      await store.dispatch("resetChatList", res.data);
      return true;
    } else {
      await store.dispatch("resetChatList", []);
      dsAlert({ type: "error", message: `chat list is valid!` });
      return false;
    }
  }
}

/**
 * 获得对话对于模型参数的设置
 * @return {Promise<boolean}>} 操作的结果
 */
export async function getChatSettings() {
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;
  const cid = store.state.curChatId;

  if (!isLoggedIn || !username || !cid) return false;

  const res = await getChatSettingsAPI(username, cid);
  if (!res.flag) {
    dsAlert({ type: "error", message: `Get current chat settings failed: ${res.log}` });
    return false;
  } else {
    const validData = JSON.parse(res.data);
    await store.dispatch("setCurChatModelSettings", validData);
    return true;
  }
}

/**
 * 设置对话的模型参数
 * @return {Promise<boolean}>} 操作的结果
 */
export async function setChatSettings() {
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;
  const cid = store.state.curChatId;

  if (!isLoggedIn || !username || !cid) return false;

  const curChatModelSettings = store.state.curChatModelSettings;
  const data = JSON.stringify(curChatModelSettings);

  const res = await setChatSettingsAPI(username, cid, data);
  if (!res.flag) {
    dsAlert({ type: "error", message: `Set current chat settings failed: ${res.log}` });
    return false;
  }

  return true;
}

/**
 * 新增一个对话，并更新本地状态和服务器数据。
 *
 * 1. 本地生成唯一对话 ID 和名称，更新 Vuex 中的 chatList。
 * 2. 设置当前活跃对话 ID。
 * 3. 若用户已登录，则向服务器发送新增对话请求。
 * 4. 设置默认的对话模型配置。
 *
 * @param {string|null} name - 可选参数，指定新对话的名称。若为空，则随机生成。
 * @returns {Promise<boolean>} 新增对话是否成功。
 */
export async function addChat(name = null) {
  // 更新store确保没有和server连接时候也能正常工作
  const cid = getUuid("chat");
  const cname = name ? name : generateRandomCname();
  const chatList = [...store.state.chatList];
  chatList.push({ cid, cname });
  await store.dispatch("resetChatList", chatList);
  await store.dispatch("setCurChatId", cid);

  // 把设置存到 server
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;
  if (!isLoggedIn || !username) return false;

  const res = await addChatAPI(username, cid, cname);
  if (!res.flag) {
    dsAlert({ type: "error", message: `增加对话失败: ${res.log}` });
    return false;
  }

  // 同时设置对话的模型的设置
  await setChatSettings();
  return true;
}

/**
 * 删除指定对话，并同步更新本地状态与服务器数据。
 *
 * 1. 从 Vuex 的 chatList 中移除指定对话。
 * 2. 若用户已登录，则向服务器发送删除请求。
 *
 * @param {string} cid - 要删除的对话 ID。
 * @returns {Promise<boolean>} 删除操作是否成功。
 */
export async function deleteChat(cid) {
  // 拷贝当前的对话列表，避免直接修改 state
  const chatList = [...store.state.chatList];

  // 查找要删除的对话在列表中的索引
  const index = chatList.findIndex((chat) => chat.cid === cid);
  if (index >= 0) {
    // 从本地列表中移除该对话
    chatList.splice(index, 1);
  }

  // 更新 Vuex 中的对话列表
  await store.dispatch("resetChatList", chatList);

  // 获取当前用户信息
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;

  // 如果未登录或没有用户名，跳过服务器操作
  if (!isLoggedIn || !username) return false;

  // 调用 API 删除服务器上的对话记录
  const res = await deleteChatAPI(username, cid);
  if (!res.flag) {
    dsAlert({ type: "error", message: `Delete chat failed: ${res.log}` });
    return false;
  }

  return true;
}

/**
 * 重命名对话
 * @return {Promise<boolean>} 操作的结果
 */
export async function renameChat(cid, cname) {
  const chatList = [...store.state.chatList];
  const index = chatList.findIndex((chat) => chat.cid === cid);
  if (index >= 0) chatList[index].cname = cname;
  await store.dispatch("resetChatList", chatList);

  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;
  if (!isLoggedIn || !username) return false;

  const res = await renameChatAPI(username, cid, cname);
  if (!res.flag) {
    dsAlert({ type: "error", message: `Rename chat failed: ${res.log}` });
    return false;
  }

  return true;
}

/**
 * 获得全部消息
 * @return {any[]} 返回数据库的对话数据
 */
export async function getAllMessage(callback) {
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;
  const cid = store.state.curChatId;
  if (!isLoggedIn || !username || !cid) return false;

  const res = await getAllMessageAPI(username, cid);
  if (!res.flag) {
    dsAlert({ type: "error", message: `Get all messages list failed: ${res.log}` });
    return [];
  } else {
    for (let index = 0; index < res.data.length; index++) {
      const data = res.data[index];
      const mid = data.mid;
      const strMsg = data.message;
      const message = JSON.parse(strMsg);
      await store.dispatch("pushMessages", message);
      if (callback) {
        callback([{ ...message, mid }]);
      }
    }
    return true;
  }
}

/**
 * 新增消息
 * @return {Promise<boolean>} 操作的结果
 */
export async function addMessage(mid, message) {
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;
  const cid = store.state.curChatId;
  if (!isLoggedIn || !username || !cid) return false;

  const msgStr = JSON.stringify(message);
  const res = await addMessageAPI(username, cid, mid, msgStr);
  if (!res.flag) {
    dsAlert({ type: "error", message: `Add message failed: ${res.log}` });
    return false;
  }
  return true;
}

/**
 * 删除消息
 * @return {Promise<boolean>} 操作的结果
 */
export async function deleteMessage(mid) {
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;
  const cid = store.state.curChatId;
  if (!isLoggedIn || !username || !cid) return false;

  const res = await deleteMessageAPI(username, cid, mid);
  if (!res.flag) {
    dsAlert({ type: "error", message: `Delete message failed: ${res.log}` });
    return false;
  }
  return true;
}
