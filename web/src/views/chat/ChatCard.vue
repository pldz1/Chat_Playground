<template>
  <div class="chat-container">
    <div class="roles-card" v-if="isShowRoleCard">
      <RolesCard />
    </div>
    <!-- Message Output -->
    <el-scrollbar class="scroll-window" ref="scrollbarRef">
      <div id="chat-messages-container" ref="innerRef"></div>
    </el-scrollbar>
    <!-- Message Input -->
    <div class="chat-input-area">
      <ChatInputArea></ChatInputArea>
    </div>
    <!-- footer -->
    <div class="footer" v-if="false">
      <el-text class="tips"> time: {{ requestTimeObj.time }}ms </el-text>
      <el-text class="tips"> {{ tokens }}/{{ chatParams.maxTokens }} tokens to be sent </el-text>
    </div>

    <div class="chat-sticker" v-if="!isShowRoleCard">
      <div class="sticker-button" v-html="SVGS.chatToTopIcon" @click="setScrollToTop"></div>
      <div class="sticker-button" v-html="SVGS.chatToBottomIcon" @click="setScrollToBottom"></div>
    </div>
  </div>
  <!-- item editor ovelay -->
  <TextEditor />
  <UserSettings />
</template>

<script setup>
import * as SVGS from "@/assets/image/chat-svgs.js";
import TextEditor from "@/components/TextEditor.vue";
import RolesCard from "./RolesCard.vue";
import UserSettings from "../home/UserSettings.vue";
// import chatCardHandler from "@/services/chat/card.js";
import ChatInputArea from "@/components/ChatInputArea.vue";

import { useStore } from "vuex";
import { ref, computed, watch, onMounted, nextTick } from "vue";
// import { showMessage, showMessageBox } from "@/utils/custom-message.js";
import { pasteImage } from "@/services/user/files.js";
// import { pasteImage, uploadImageFile } from "@/services/user/files.js";

const store = useStore();
const chatParams = computed(() => store.state.chat.chatParams);
const tokens = computed(() => store.state.chat.tokens);

// const userQuestionText = ref("");
// const isChatting = ref(false);
const isShowRoleCard = ref(true);
const requestTimeObj = ref({
  startTime: 0,
  time: 0,
});

const scrollbarRef = ref();
const innerRef = ref();

onMounted(() => {
  pasteImage();
});

watch(
  () => store.state.chat.chatCid,
  async (value) => {
    if (value !== "") {
      isShowRoleCard.value = false;
    } else {
      isShowRoleCard.value = true;
      requestTimeObj.value.time = 0;
    }
  }
);

/** 输入框的按键组合键 */
// const onEnterKeydown = async (event) => {
//   // Enter 和 Shift 键表示换行的操作
//   if (event.key === "Enter" && !event.shiftKey) {
//     // 阻止默认行为（换行）并发送内容
//     event.preventDefault();
//     if (isShowRoleCard.value) isShowRoleCard.value = false;
//     await onSendContent();
//   }
// };

/** 向服务器发送数据 */
// const onSendContent = async () => {
//   if (isChatting.value) {
//     const flag = await showMessageBox("取消继续生成对话吗?");
//     if (flag) {
//       chatCardHandler.stopChat();
//       isChatting.value = false;
//     }
//     return;
//   }

//   // 及时清空对话框
//   var msg = userQuestionText.value;
//   if (msg == "") {
//     showMessage("warning", "输入正确的问题");
//     return;
//   }
//   userQuestionText.value = "";

//   // 请求API
//   isChatting.value = true;
//   startRequestTime();

//   await chatCardHandler.sendChat(msg, setScrollToBottom);
//   isChatting.value = false;
//   chatCardHandler.addListener();
//   stopRequestTime();
// };

// const startRequestTime = () => {
//   requestTimeObj.value.time = 0;
//   requestTimeObj.value.startTime = new Date().getTime();
// };

// const stopRequestTime = () => {
//   requestTimeObj.value.time = new Date().getTime() - requestTimeObj.value.startTime;
// };

/**
 * 默认显示最新的内容，拖拉条滚动到最底部
 * Element-plus 如何让滚动条永远在最底部（支持在线演示）
 * https://blog.csdn.net/qq_42203909/article/details/133816286
 */
const setScrollToBottom = async () => {
  await nextTick();
  const max = innerRef.value.clientHeight;
  scrollbarRef.value.setScrollTop(max);
};

const setScrollToTop = async () => {
  await nextTick();
  scrollbarRef.value.setScrollTop(0);
};
</script>

<style lang="scss" scoped>
.scroll-window :deep(.el-button) {
  margin-left: 0px !important;
  padding: 0px !important;
}
</style>
