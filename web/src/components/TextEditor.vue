<template>
  <!-- overlay-dialog -->
  <el-dialog
    class="chat-item-editor-overlay"
    v-model="isShowDialog"
    align-center
    append-to-body
    :close-on-click-modal="false"
  >
    <!-- header -->
    <template #header>
      <div class="header">
        <el-text :tag="'b'" class="label">Edit chat item</el-text>
      </div>
      <el-divider class="divider" />
    </template>
    <!-- settings tab -->
    <div class="content">
      <el-input
        class="editor"
        v-model="beEditedData"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 8 }"
      >
      </el-input>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="cancel" @click="onCancel">Cancel</el-button>
        <el-button class="save" @click="onConfirm"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { showMessageBox } from "@/utils/custom-message.js";

const store = useStore();

watch(
  () => store.state.app.textEditObj,
  (newObject) => {
    if (newObject.data) {
      beEditedData.value = newObject.data;
      options.value = newObject.options;
      isShowDialog.value = true;
    }
  }
);

const options = ref({});
const isShowDialog = ref(false);
const beEditedData = ref("");

const onConfirm = async () => {
  var flag = await showMessageBox("保存对内容的修改吗?");
  if (!flag) return;

  if (options.value.confirmCallback) {
    await options.value.confirmCallback(beEditedData.value);
  }
  isShowDialog.value = false;
};

const onCancel = async () => {
  if (options.value.cancelCallback) {
    await options.value.cancelCallback(beEditedData.value);
  }
  isShowDialog.value = false;
};
</script>

<style lang="scss" scoped>
.editor :deep(.el-textarea__inner) {
  height: 100% !important;
  border: none !important; /* Remove border */
  outline: none; /* Remove focus outline */
  box-shadow: none; /* Remove any box shadow */
  background-color: #f4f4f4;
  resize: none !important;
}
</style>
