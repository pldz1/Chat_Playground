<template>
  <div class="container">
    <!-- 头部 -->
    <HeaderBar :chat-list="true" :chat-model-info="true" @on-show-chat-list="onShowSidebar"></HeaderBar>
    <div class="content">
      <!-- Settings overlay -->
      <!-- <SettingsCard /> -->
      <!-- Sidebar -->
      <!-- <SidebarCard v-if="isShowSidebar" /> -->
      <!-- Chat main worksapce -->
      <!-- <div class="chat-card" id="global-chat-card"><ChatCard /></div> -->
    </div>
  </div>
</template>

<script setup>
import SettingsCard from "./SettingsCard.vue";
import SidebarCard from "./SidebarCard.vue";
import ChatCard from "./ChatCard.vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { showMessage } from "@/utils/custom-message.js";

const isShowSidebar = ref(true);
const store = useStore();
const router = useRouter();
// const isLogged = computed(() => store.state.user.isLogged);

/** ====================== 下面定义函数 ====================== */
onMounted(async () => {
  // if (!isLogged.value) {
  //   showMessage("error", "请先登录！");
  //   // 回到登录界面
  //   router.push({
  //     path: "/",
  //   });
  // }
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
  height: 100vh;
  width: 100vw;

  .content {
    position: relative;
    left: 0px;
    top: 0px;
    height: 100%;
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
