export const codeContent =
  '🎉当然！以下是一个使用Python实现的冒泡排序算法的示例：\n\n```python\ndef bubble_sort(arr):\n    n = len(arr)\n    # 遍历所有数组元素\n    for i in range(n):\n        # 最后i个元素已经是有序的\n        for j in range(0, n-i-1):\n            # 如果当前元素大于下一个元素，则交换它们测试最大的长度 ============================================================================================================ ==========\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n        # 打印每一轮排序结果用于调试\n        print(f"第{i+1}轮排序结果: {arr}")\n    return arr\n\n# 示例数组\narr = [64, 34, 25, 12, 22, 11, 90]\nprint("初始数组:", arr)\n\n# 调用冒泡排序函数\nsorted_arr = bubble_sort(arr)\nprint("排序后的数组:", sorted_arr)\n```\n\n在这个代码中：\n1. `bubble_sort`函数接受一个列表作为参数，并对其进行冒泡排序。\n2. 外层循环控制遍历的轮数。\n3. 内层循环用于比较和交换相邻的元素。\n4. 每一轮结束后，最大的元素都会被“冒泡”到列表的末尾。\n5. 在排序过程中，会打印出每一轮排序的中间结果，方便调试和观察排序过程。\n\n运行此代码将会输出每一轮排序后的数组状态，最终输出完全排序的数组。';

export function* yieldContent() {
  let i = 0;
  while (i < codeContent.length) {
    // 随机生成 1 到 20 之间的数
    const chunkSize = Math.floor(Math.random() * 20) + 1;
    // 获取一个片段
    const chunk = codeContent.slice(i, i + chunkSize);
    yield chunk; // 一次性返回这部分字符
    i += chunkSize; // 更新索引，跳过已经返回的字符
    // 休眠 20ms
    yield new Promise((resolve) => setTimeout(resolve, 20));
  }
}
