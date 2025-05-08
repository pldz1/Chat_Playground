import store from "@/store";
import { apiRequest } from "./axios-request.js";
import { dsAlert, getUuid } from "@/utils";

/**
 * 获取全部的图像列表
 * @return {Promise<{ flag: boolean, log: string, data:T_ImageDataItem[] }>} 服务器返回的结果
 */
export const getImageListAPI = (username) => apiRequest("post", "/api/v1/image/getImageList", { username });

/**
 * 添加一张图像数据
 * @return {Promise<{ flag: boolean, log: string, data:string }>} 服务器返回的结果
 */
export const pushImageAPI = (username, id, prompt, url) =>
  apiRequest("post", "/api/v1/image/pushImage", {
    username: username,
    image_id: id,
    image_prompt: prompt,
    image_url: url,
  });

/**
 * 删除一张图像数据
 * @return {Promise<{ flag: boolean, log: string }>} 服务器返回的结果
 */
export const deleteImageAPI = (username, id) =>
  apiRequest("post", "/api/v1/image/deleteImage", {
    username: username,
    image_id: id,
  });

/**
 * 获取全部的图像列表
 */
export async function getImageList() {
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;
  if (!isLoggedIn || !username) return false;

  const res = await getImageListAPI(username);
  if (!res.flag) {
    await store.dispatch("resetImageList", []);
    dsAlert({ type: "error", message: `Get image list failed: ${res.log}` });
    return false;
  } else {
    if (Array.isArray(res.data)) {
      const reversed = res.data.slice().reverse();
      await store.dispatch("resetImageList", reversed);
    } else {
      await store.dispatch("resetImageList", []);
      dsAlert({
        type: "error",
        message: `Get image list failed: response data is not a array!`,
      });
    }
  }
}

/**
 * 增加一张图像
 * @return {Promise<boolean}>} 操作的结果
 */
export async function pushImage(prompt, url) {
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;

  // 直接塞入url 比较省事
  const id = getUuid("img");
  await store.dispatch("pushImage", { id: id, prompt: prompt, src: url });

  if (!isLoggedIn || !username) return false;

  const res = await pushImageAPI(username, id, prompt, url);
  if (!res.flag) {
    dsAlert({
      type: "error",
      message: `Push new image to server failed: ${res.log}`,
    });
    return false;
  } else {
    return true;
  }
}

/**
 * 删除一张图像数据
 * @return {Promise<boolean}>} 操作的结果
 */
export async function deleteImage(id) {
  const username = store.state.username;
  const isLoggedIn = store.state.isLoggedIn;

  await store.dispatch("deleteImage", id);

  if (!isLoggedIn || !username) return false;

  const res = await deleteImageAPI(username, id);
  if (!res.flag) {
    dsAlert({
      type: "error",
      message: `Delete the image in the server failed: ${res.log}`,
    });
    return false;
  }

  return true;
}
