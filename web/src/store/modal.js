export const ModalState = {
  /**
   * 预览图像的 base64 的数据
   * @type {string}
   */
  modalImgSrc: "",

  /**
   * 设置要显示的图像
   * @param {string} t 目标的图像.
   */
  setModalImage(t) {
    this.modalImgSrc = t;
  },
};
