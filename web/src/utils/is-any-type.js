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
 * 检查对象是否符合 `chatModel` 的结构
 * @param {any} obj - 需要验证的对象
 * @returns {boolean} 是否符合 `chatModel` 结构
 */
export function isValidChatModel(obj) {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return false;
  }

  // 预期的属性及其类型
  const requiredFields = {
    name: "string",
    type: "string",
    baseURL: "string",
    endpoint: "string",
    apiKey: "string",
    model: "string",
    deployment: "string",
    apiVersion: "string",
  };

  // 遍历 `requiredFields` 确保 `obj` 具备所有属性，且类型正确
  for (const key in requiredFields) {
    if (!(key in obj) || typeof obj[key] !== requiredFields[key]) {
      return false;
    }
  }

  return true;
}
