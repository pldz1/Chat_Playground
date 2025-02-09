<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <HeaderBar @on-show-chat-list="onShowSidebar"></HeaderBar>
    </div>
    <div class="content">
      <!-- Settings overlay -->
      <!-- <SettingsCard /> -->
      <!-- 对话侧边栏 -->
      <SidebarCard v-if="isShowSidebar" />
      <!-- Chat main worksapce -->
      <div class="chat-card" id="global-chat-card"><ChatCard /></div>
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
import { useRouter } from "vue-router";
import { showMessage } from "@/utils/custom-message.js";

import { getChatModelsAPI } from "@/apis/user-api.js";
import { isArrayType } from "@/utils/is-any-type.js";

const isShowSidebar = ref(true);
const store = useStore();
const router = useRouter();

const username = computed(() => store.state.user.username);
const isLoggedIn = computed(() => store.state.user.isLoggedIn);

/** ====================== 下面定义函数 ====================== */
onMounted(async () => {
  // if (!isLogged.value) {
  //   showMessage("error", "请先登录！");
  //   // 回到登录界面
  //   router.push({
  //     path: "/",
  //   });
  // }

  // 初始化获得一些用户对于对话模型的参数
  if (!isLoggedIn.value) return;
  const cmRes = await getChatModelsAPI(username.value);
  if (cmRes.flag && isArrayType(cmRes.data)) {
    const chatModels = JSON.parse(cmRes.data);
    store.dispatch("setChatModels", chatModels);
  }
});

/** 根据子组件的信号来控制显示或者隐藏侧边栏 */
const onShowSidebar = (val) => {
  isShowSidebar.value = val;
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 100%;

  .header {
    height: 48px;
  }

  .content {
    position: relative;
    left: 0px;
    top: 0px;
    height: calc(100% - 48px);
    width: 100%;
    display: flex;
    flex-direction: row;

    .chat-card {
      width: calc(100% - 232px);
      height: 100%;
    }
  }
}
</style>
