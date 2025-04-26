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
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { dsAlert } from "@/utils";
import { getModels, getChatList, getChatInsTemplateList } from "@/services";
import { useRouter } from "vue-router";

import SidebarCard from "./SidebarCard.vue";
import ChatCard from "./ChatCard.vue";
import HeaderBar from "./HeaderBar.vue";
import ImageModal from "@/components/ImageModal.vue";

const props = defineProps({
  id: {
    type: String,
    require: false,
    default: "",
  },
});

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.state.isLoggedIn);
const chatList = computed(() => store.state.chatList);
const curChatModel = computed(() => store.state.curChatModel);
const models = computed(() => store.state.models);
const isShowSidebar = ref(true);

onMounted(async () => {
  // 设置初始化的模型
  await getModels();

  // 设置对话列表
  await getChatList();
  await getChatInsTemplateList();

  if (props.id) {
    if (chatList.value.includes(props.id)) {
      //
    } else {
      dsAlert({ type: "error", message: "不存在这个对话记录." });
      // 重置store的消息内容
      await store.dispatch("resetMessages");
      router.push({ path: "/chat" });
    }
  } else {
    // 重置store的消息内容
    await store.dispatch("resetMessages");
  }

  // 初始化获得一些用户对于对话模型的参数
  if (!isLoggedIn.value) {
    dsAlert({ type: "warn", message: "未登录, 登录获得更好体验🤣." });
    // router.push({ path: "/login" });
    return;
  }

  if (!curChatModel.value.apiKey && !curChatModel.value.name) {
    if (models.value.chat.length > 0) {
      await store.dispatch("setCurChatModel", models.value.chat[0]);
    }
  }
});
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
