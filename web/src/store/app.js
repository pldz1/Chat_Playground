/**
 * 存放网页用到的一些响应式的全局变量
 */
export const AppState = {
  /**
   * 当前文本内容通用的编辑界面传递的全局变量
   * @type {string}
   */
  textEditObj: {
    data: null,
    options: {
      confirmCallback: () => {},
      cancelCallback: () => {},
    },
  },

  /**
   * 赋值给编辑的对话
   * @param {object} data
   */
  setTextEditObj(data) {
    this.textEditObj = data;
  },
};
