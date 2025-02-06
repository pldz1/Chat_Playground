import chatCardHandler from "./card.js";
import StoreHelper from "@/store/store-helper";

import { isEqual } from "lodash";
import { showMessage } from "@/utils/custom-message.js";
import { setChatParamsAPI } from "../../apis/chat.js";

const imageModel = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"];

/** getPromptByRole 定义一个函数来获取指定角色的提示内容
 *   ⭐⭐⭐ 目前的prompts不支持放入图像, 所以不用考虑有图像的情况 */
export const getPromptByRole = (chatParams, role) => {
  if (chatParams.prompts) {
    const contentList = (chatParams.prompts.find((item) => item.role === role) || {}).content;

    if (contentList) {
      return contentList[0].text;
    }
  }
  return "";
};

/** validStopSequence 判断输入的字符串 是不是符合是一个由;分隔可以组成字符串数组的的字符串  */
export const validStopSequence = (chatParams, chatStopSequence) => {
  // 去除换行符并分割字符串, 并且要保证不会出现''的数组内容
  const resultArray = chatStopSequence
    .replace(/\n/g, "")
    .split(";")
    .filter((item) => item.trim() !== "");

  chatParams.stopSequence = resultArray;
};

/** handleChatPrompts 根据输入的提示词 时刻生成对应的提示文本信息 */
export const handleChatPrompts = (chatParams, sys, user, ass) => {
  const key = "content";
  const tmpPrompts = [
    {
      role: "system",
      content: [{ type: "text", text: (sys || "").replace(/\n/g, "") }],
    },
    {
      role: "user",
      content: [{ type: "text", text: (user || "").replace(/\n/g, "") }],
    },
    {
      role: "assistant",
      content: [{ type: "text", text: (ass || "").replace(/\n/g, "") }],
    },
  ];

  chatParams.prompts = tmpPrompts.filter((item) => item[key] !== "" && item[key] !== undefined);
};

/** onSelectModel 选择模型 更新对应的参数 */
export const onSelectModel = (chatParams, item) => {
  chatParams.modelName = item.modelName;
  chatParams.maxTokens = item.maxTokens;
  chatParams.modelType = item.modelType;
};

/** handleSetChatParams 处理修改新建/保存当前对话的参数的函数 */
export const handleSetChatParams = async (chatParams) => {
  const storeChatParams = StoreHelper.getChatParams();
  const isEditFlag = isEqual(storeChatParams, chatParams);
  // 没有改动 返回
  if (isEditFlag) return;

  // 判断是不是必须要求是理解图像的对话内容
  const isImageModel = chatCardHandler.checkImgsExit();
  if (isImageModel) {
    const flag = imageModel.includes(chatParams.modelType);
    if (!flag) {
      showMessage("error", `对话包含图像数据 必须选择具有图像解析的模型: 【'gpt-4o', 'gpt-4o-mini', 'gpt-4-tubo'】`);
      return;
    }
  }

  // 要编辑/新建的chatCid的值
  var chatCid = await chatCardHandler.getValidChatCid();
  if (chatCid == "") return;

  // 开始设置对话的参数到数据库
  const rea = await setChatParamsAPI(chatCid, chatParams);
  if (!rea.flag) {
    showMessage("error", `向服务器设置参数失败! 【${rea.log}】`);
    return;
  }

  StoreHelper.setChatParams(chatParams);
  StoreHelper.editChatNameList(chatCid, chatParams.chatName);
};

/** checkImageModel 判断模型是不是支持图像对话 */
export const checkImageModel = () => {
  const chatParams = StoreHelper.getChatParams();
  const modelType = chatParams.modelType;
  const flag = imageModel.includes(modelType);
  if (!flag) {
    showMessage("error", `对话包含图像数据 必须选择具有图像解析的模型: ${imageModel}`);
    return false;
  }
  return true;
};
