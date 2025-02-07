import { apiRequest } from "./common.js";

/** 开始登录 */
export const loginAPI = () => apiRequest("post", "/login", { data: "" });

/** 退出登录 */
export const logoutAPI = () => apiRequest("post", "/logout");

/** ✏️ 修改用户的默认对话参数 */
export const setUserChatParamsAPI = (params) => apiRequest("post", "/user/setUserChatParams", { data: params });

/** ⚙️ 获得用户的默认对话参数 */
export const getUserChatParamsAPI = () => apiRequest("get", "/user/getUserChatParams");

/** ✏️ 修改用户的默认配置 */
export const setUserSettingAPI = (params) => apiRequest("post", "/user/setUserSetting", { data: params });

/** ⚙️ 获得用户的默认设置 */
export const getUserSettingAPI = () => apiRequest("get", "/user/getUserSetting");

/** ❌ 删除用户的全部对话 */
export const deleteAllChatAPI = () => apiRequest("post", "/user/deleteAllChat");
