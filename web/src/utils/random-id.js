/**
 *  生成 4 位随机字符串（大小写字母 + 数字）
 */
function random4Segment() {
  return Math.random().toString(36).slice(-4);
}

export function getUuid(prefix) {
  const timestamp = Date.now();
  const base36Timestamp = timestamp.toString(36);
  const pre = prefix ? prefix : random4Segment();
  const id = `${pre}-${base36Timestamp}-${random4Segment()}-${random4Segment()}`;
  return id;
}
