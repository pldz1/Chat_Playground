import { ElMessageBox, ElMessage } from "element-plus";

const showMessageBox = async (message, confirmCallback, cancelCallback) => {
  var flag = await ElMessageBox.confirm(message, "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
    customClass: "global-custom-messagebox",
  })
    .then(() => {
      if (confirmCallback) {
        confirmCallback();
      }
      return true;
    })
    .catch(() => {
      if (cancelCallback) {
        cancelCallback();
      }
      return false;
    });

  return flag;
};

const showMessage = (type, message) => {
  ElMessage({
    type: type,
    customClass: "global-custom-message",
    message: message,
  });
};

export { showMessageBox, showMessage };
