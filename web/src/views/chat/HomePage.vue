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
import SettingsCard from "./SettingsCard.vue";
import SidebarCard from "./SidebarCard.vue";
import ChatCard from "./ChatCard.vue";
import HeaderBar from "./HeaderBar.vue";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { dsAlert } from "@/utils";
import { getChatModels } from "@/services";

const isShowSidebar = ref(true);
const store = useStore();

const username = computed(() => store.state.user.username);
const isLoggedIn = computed(() => store.state.user.isLoggedIn);

/** ====================== 下面定义函数 ====================== */
onMounted(async () => {
  // 初始化获得一些用户对于对话模型的参数
  if (!isLoggedIn.value) {
    dsAlert({ type: "warn", message: "未登录, 登录获得更好体验🤣." });
    return;
  }
  await getChatModels(username.value);
});

/** 根据子组件的信号来控制显示或者隐藏侧边栏 */
const onShowSidebar = (val) => {
  isShowSidebar.value = val;
};
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
