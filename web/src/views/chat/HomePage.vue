<template>
  <div class="chat-homepage-container">
    <!-- 头部 -->
    <div class="chpc-header">
      <HeaderBar></HeaderBar>
    </div>
    <!-- 对话内容 -->
    <div class="chpc-content">
      <!-- 对话侧边栏 -->
      <SidebarCard />
      <!-- 对话的主卡片 -->
      <ChatCard />
    </div>
  </div>
  <!-- 全局弹窗 -->
  <ImageModal />
</template>

<script setup>
import { watch, computed } from "vue";
import { useStore } from "vuex";
import { dsAlert } from "@/utils";
import { getChatList, getChatInsTemplateList } from "@/services";

import SidebarCard from "@/views/chat/SidebarCard.vue";
import ChatCard from "@/views/chat/ChatCard.vue";
import HeaderBar from "@/components/HeaderBar.vue";
import ImageModal from "@/components/ImageModal.vue";

const store = useStore();
const isLoggedIn = computed(() => store.state.isLoggedIn);
const curChatModel = computed(() => store.state.curChatModel);
const models = computed(() => store.state.models);

/**
 * 监听登录的状态, 来做页面的初始化
 */
watch(
  () => isLoggedIn.value,
  async () => {
    // 设置对话列表
    await getChatList();
    await getChatInsTemplateList();

    // 重置store的消息内容
    await store.dispatch("resetMessages");

    // 初始化获得一些用户对于对话模型的参数
    if (!isLoggedIn.value) {
      dsAlert({ type: "warn", message: "未登录, 登录获得更好体验🤣." });
      return;
    }

    if (!curChatModel.value.apiKey && !curChatModel.value.name) {
      if (models.value.chat.length > 0) {
        await store.dispatch("setCurChatModel", models.value.chat[0]);
      }
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.chat-homepage-container {
  position: relative;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 100%;

  .chpc-header {
    position: relative;
    height: 48px;
  }

  .chpc-content {
    position: relative;
    width: 100%;
    height: calc(100% - 48px);
    display: flex;
    flex-direction: row;
  }
}
</style>
