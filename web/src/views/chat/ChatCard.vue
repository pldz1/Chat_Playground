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
      <ChatInputArea :is-chatting="isChatting" @on-send="onSendContent"></ChatInputArea>
    </div>

    <div class="chat-sticker" v-if="!isShowRoleCard">
      <div class="sticker-button" v-html="chatToTopIcon" @click="setScrollToTop"></div>
      <div class="sticker-button" v-html="chatToBottomIcon" @click="setScrollToBottom"></div>
    </div>
  </div>
  <!-- item editor ovelay -->
  <TextEditor />
  <UserSettings />
</template>

<script setup>
import { chatToBottomIcon, chatToTopIcon } from "@/assets/image/chat-svgs.js";
import TextEditor from "@/components/TextEditor.vue";
import RolesCard from "./RolesCard.vue";
import UserSettings from "../home/UserSettings.vue";
import chatCardHandler from "@/services/chat/card.js";
import ChatInputArea from "@/components/ChatInputArea.vue";

import { useStore } from "vuex";
import { ref, watch, nextTick } from "vue";
import { showMessage, showMessageBox } from "@/utils/custom-message.js";

const store = useStore();

const isChatting = ref(false);
const isShowRoleCard = ref(true);

const scrollbarRef = ref();
const innerRef = ref();

watch(
  () => store.state.chat.chatCid,
  async (value) => {
    if (value !== "") {
      isShowRoleCard.value = false;
    } else {
      isShowRoleCard.value = true;
    }
  },
);

/** 向服务器发送数据 */
const onSendContent = async (value) => {
  if (isChatting.value) {
    const flag = await showMessageBox("取消继续生成对话吗?");
    if (flag) {
      chatCardHandler.stopChat();
      isChatting.value = false;
    }
    return;
  }

  // 及时清空对话框
  var msg = value;
  if (msg == "") {
    showMessage("warning", "输入正确的问题");
    return;
  }

  // 请求API
  isChatting.value = true;

  await chatCardHandler.sendChat(msg, setScrollToBottom);
  isChatting.value = false;
  chatCardHandler.addListener();
};

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
