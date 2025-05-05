export const ImageState = {
  /**
   *  @type {T_ImageDataItem[]}
   */
  imageList: [],

  resetImageList(t) {
    this.imageList = [...t];
  },

  pushImage(t) {
    this.imageList.splice(0, 0, t);
  },

  deleteImage(id) {
    const index = this.imageList.findIndex((t) => t.id == id);
    if (index >= 0) {
      this.imageList.slice(index, 1);
    }
  },
};
