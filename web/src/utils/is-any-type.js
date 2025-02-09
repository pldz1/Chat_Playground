export function isArrayType(jsonStr) {
  try {
    const parsedData = JSON.parse(jsonStr);
    // 判断解析后的数据是否是数组
    return Array.isArray(parsedData);
  } catch (error) {
    // 如果 JSON.parse 失败（例如无效的 JSON 字符串），返回 false
    return false;
  }
}
