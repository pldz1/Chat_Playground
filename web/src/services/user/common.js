import StoreHelper from "@/store/store-helper";
import { isEqual } from "lodash";
import { initChatPage } from "../chat/common.js";
import { showMessage } from "@/utils/custom-message.js";
import { getChatParamsAPI } from "../../apis/chat.js";
import {
  loginAPI,
  deleteAllChatAPI,
  getUserSettingAPI,
  setUserSettingAPI,
  setUserChatParamsAPI,
  getUserChatParamsAPI,
} from "../../apis/user.js";

export const login = async (userName, passWord) => {
  StoreHelper.setUserLoginInfo(userName, passWord);
  var rea = await loginAPI();
  // 登录成功
  if (!rea.flag) {
    showMessage("error", `登录失败! ${rea.log} 🙃`);
    return false;
  }
  showMessage("success", "登录成功! 😀");
  await initUserSettings();
  await initChatPage();
  StoreHelper.setLoginInfo(true, rea.userName, rea.uid);
  return true;
};

/** 根据登录的用户名称来初始化一些操作 */
export const initUserSettings = async () => {
  var rea = await getUserSettingAPI();
  if (!rea.flag) {
    showMessage("error", "获取服务器默认的用户设置参数失败! 🤡");
    return;
  }
  // 更新用户默认的设置
  StoreHelper.setUserSettings(rea.data);

  rea = await getUserChatParamsAPI();
  if (!rea.flag) {
    showMessage("error", "获取服务器默认的对话参数失败! 🙃");
    return;
  }

  // 更新用户默认对话的参数信息
  StoreHelper.setUserChatParams(rea.data);

  showMessage("success", "用户默认参数更新成功! 😀");
};

/** 用户点击保存设置的执行内容 */
export const confirmUserSettings = async (chatParams, userSettings) => {
  const storeChatParams = StoreHelper.getUserDefaultChatParams();
  const storeSettings = StoreHelper.getUserDefaultSettings();

  // 不一样才发送接口更改信息
  let chatParamsFlag = isEqual(storeChatParams, chatParams);
  if (!chatParamsFlag) {
    let rea = await setUserChatParamsAPI(chatParams);
    if (!rea.flag) {
      showMessage("error", "设置用户默认的对话参数失败 🤡");
      return false;
    }
    StoreHelper.setUserChatParams(chatParams);
  }

  // 不一样才发送接口更改信息
  let userSettingsFlag = isEqual(storeSettings, userSettings);
  if (!userSettingsFlag) {
    let rea = await setUserSettingAPI(userSettings);
    if (!rea.flag) {
      showMessage("error", "设置用户默认的配置参数失败 🤡");
      return false;
    }
    StoreHelper.setUserSettings(userSettings);
  }

  //  如果是新建对话的界面 同步一下设置到store的缓存
  if (StoreHelper.getChatCid() == "") {
    let rea = await getChatParamsAPI("");
    if (rea.flag) StoreHelper.setChatParams(rea.data);
  }

  return true;
};

/** 用户点击删除全部对话的操作 */
export const deleteAllChat = async () => {
  const res = await deleteAllChatAPI();
  if (res.flag) {
    StoreHelper.setChatNameList([]);
    showMessage("success", "对话已经删除. 😀");
    return true;
  }
  return false;
};
