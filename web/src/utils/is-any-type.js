/**
 * 检测 string 变量是不是能够被解析成一个数组
 * @param {*} jsonStr
 * @returns
 */
export function isArrayTypeStr(jsonStr) {
  try {
    const parsedData = JSON.parse(jsonStr);
    // 判断解析后的数据是否是数组
    return Array.isArray(parsedData);
  } catch (error) {
    // 如果 JSON.parse 失败（例如无效的 JSON 字符串），返回 false
    return false;
  }
}

/**
 * 验证用户消息是否有效。
 *
 * 一个消息对象被认为是有效的，如果它包含至少一个非空的文本或者有效的图片 URL。
 * 具体来说：
 * - 如果`content`数组为空，或者只有空文本消息，则视为无效。
 * - 如果存在图片消息，则图片 URL 必须有效。
 *
 * @param {Object} userMsg - 用户消息对象。
 * @param {string} userMsg.role - 消息的角色（例如："user"）。
 * @param {Array} userMsg.content - 消息内容数组，数组中每个元素代表一个消息片段。
 * @param {Object} userMsg.content[] - 内容数组中的每个消息项。
 * @param {string} userMsg.content[].type - 内容类型，可能的值为 `"text"` 或 `"image_url"`。
 * @param {string} [userMsg.content[].text] - 当`type`为`"text"`时的文本内容。
 * @param {Object} [userMsg.content[].image_url] - 当`type`为`"image_url"`时的图片信息。
 * @param {string} userMsg.content[].image_url.url - 图片的URL。
 *
 * @returns {boolean} 如果消息有效，则返回`true`，否则返回`false`。
 */
export function isValidUserMsg(userMsg) {
  if (!userMsg || !userMsg.content || !Array.isArray(userMsg.content)) {
    return false;
  }

  // 用于追踪是否有有效内容
  let hasValidContent = false;

  for (let i = 0; i < userMsg.content.length; i++) {
    const item = userMsg.content[i];

    // 如果是文本类型，并且文本非空
    if (item.type === "text" && item.text.trim() !== "") {
      hasValidContent = true;
    }

    // 如果是图片类型，确保 image_url 存在且不为空
    if (item.type === "image_url" && item.image_url?.url) {
      hasValidContent = true;
    }
  }

  return hasValidContent;
}

/**
 * 对话列表元素类型
 * @typedef {Object} ChatInfo
 * @property {string} cid - 对话的id
 * @property {string} cname - 对话的名称
 */

/**
 * 判断返回的数据是否是符合ChatInfo类型的对象数组
 * @param {Array} data - 要验证的数据
 * @returns {boolean} - 如果是符合要求的数组返回true，否则返回false
 */
export function isValidChatInfoArray(data) {
  // 检查是否是数组
  if (!Array.isArray(data)) {
    return false;
  }

  // 遍历数组中的每个元素，检查每个元素是否符合ChatInfo类型
  return data.every((item) => item !== null && typeof item === "object" && typeof item.cid === "string" && typeof item.cname === "string");
}
