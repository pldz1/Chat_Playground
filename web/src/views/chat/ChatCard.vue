<template>
  <div class="chat-card-container">
    <!-- 显示markdown的问答区域 -->
    <div class="ccdc-messages-container">
      <div id="chat-messages-container" class="cccd-scroll-window" ref="innerRef"></div>
    </div>
    <!-- 输入问题 -->
    <div class="cccd-input-area">
      <ChatInputArea :is-chatting="isChatting" @on-start="onStartChat" @on-stop="onStopChat"></ChatInputArea>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { dsAlert } from "@/utils";
import { ref, watch, computed, onMounted } from "vue";
import { ChatDrawer, addChat, getAllMessage } from "@/services";

import ChatInputArea from "@/components/ChatInputArea.vue";

const store = useStore();
const isChatting = ref(false);
const innerRef = ref(null);

const drawer = new ChatDrawer(true);
const curChatModel = computed(() => store.state.user.curChatModel);
const chatMessagesLength = computed(() => store.state.chat.messages.length);
const curChatId = computed(() => store.state.user.curChatId);

watch(
  () => curChatId.value,
  async () => {
    drawer.removeAllElem();
    getAllMessage(drawer.draw);
  },
);

watch(
  () => curChatModel.value,
  () => {
    drawer.aigcInit();
  },
  { deep: true, immediate: true },
);

/** 向服务器发送数据 */
const onStartChat = async (message) => {
  // 新建对话
  if (chatMessagesLength.value == 0) {
    await addChat();
  }
  isChatting.value = true;
  await drawer.chat(message);
  isChatting.value = false;
};

/**
 * 停止接受消息
 * */
const onStopChat = async () => {
  // isChatting.value = false;
  dsAlert({ type: "info", message: "暂时不支持暂停对话." });
};

onMounted(() => {
  drawer.init("chat-messages-container");
});
</script>

<style lang="scss" scoped>
.chat-card-container {
  position: relative;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  padding: 8px;

  .ccdc-messages-container {
    position: absolute;
    left: 10%;
    width: 80%;
    max-width: 80%;
    height: calc(100% - 128px);
    z-index: 100;
  }

  .cccd-scroll-window {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .cccd-input-area {
    position: absolute;
    bottom: 10px;
    left: 10%;
    width: 80%;
    max-width: 80%;
    z-index: 101;
    display: flex;
    justify-content: center;
  }
}
</style>
