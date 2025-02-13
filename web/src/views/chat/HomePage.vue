<template>
  <div class="chat-homepage-container">
    <!-- 头部 -->
    <div class="chpc-header">
      <HeaderBar @on-show-chat-list="onShowSidebar"></HeaderBar>
    </div>
    <div class="chpc-content">
      <!-- Settings overlay -->
      <!-- <SettingsCard /> -->
      <!-- 对话侧边栏 -->
      <SidebarCard v-if="isShowSidebar" />
      <!-- Chat main worksapce -->
      <div class="chpc-chat-card" id="global-chat-card"><ChatCard /></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { dsAlert } from "@/utils";
import { getChatModels } from "@/services";
import { useRouter } from "vue-router";

import SidebarCard from "./SidebarCard.vue";
import ChatCard from "./ChatCard.vue";
import HeaderBar from "./HeaderBar.vue";

const props = defineProps({
  id: {
    type: String,
    require: false,
    default: "",
  },
});

const store = useStore();
const router = useRouter();

const username = computed(() => store.state.user.username);
const isLoggedIn = computed(() => store.state.user.isLoggedIn);
const chatList = computed(() => store.state.user.chatList);
const curChatModel = computed(() => store.state.user.curChatModel);
const chatModels = computed(() => store.state.user.chatModels);
const isShowSidebar = ref(true);

/**
 * 根据子组件的信号来控制显示或者隐藏侧边栏
 * */
const onShowSidebar = (val) => {
  isShowSidebar.value = val;
};

onMounted(async () => {
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

  // 设置初始化的模型
  await getChatModels(username.value);

  if (!curChatModel.value.apiKey && !curChatModel.value.name) {
    if (chatModels.value.length > 0) {
      await store.dispatch("setCurChatModel", chatModels.value[0]);
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
    height: 48px;
  }

  .chpc-content {
    position: relative;
    left: 0px;
    top: 0px;
    height: calc(100% - 48px);
    width: 100%;
    display: flex;
    flex-direction: row;

    .chpc-chat-card {
      width: calc(100% - 232px);
      height: 100%;
    }
  }
}
</style>
