<template>
  <div class="component-header-bar">
    <!-- 回到主页标题 -->
    <div class="tooltip tooltip-bottom comphb-home" data-tip="回到主页">
      <button class="btn btn-square" @click="onBackHome">
        <div v-html="app32"></div>
        <span>AIGC Playground</span>
      </button>
    </div>
    <!-- 控制主题 -->
    <ThemeController class="comphb-theme-controller"></ThemeController>
    <!-- 用户管理界面 -->
    <AvatarCard class="comphb-avatar-pos" onclick="global_user_settings.showModal()"></AvatarCard>
    <UserSettings></UserSettings>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { app32 } from "@/assets/svg";
import ThemeController from "@/components/ThemeController.vue";
import AvatarCard from "@/components/AvatarCard.vue";
import UserSettings from "../user/UserSettings.vue";

const router = useRouter();

/**
 * 回到主页
 */
const onBackHome = () => {
  router.push({ path: "/home" });
};
</script>

<style lang="scss" scoped>
.component-header-bar {
  position: relative;
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 100%;
  max-height: 48px;
  background-color: oklch(var(--nc) / 0.1);
  z-index: 301;

  display: flex;
  flex-direction: row;
  align-items: center;

  .comphb-home {
    width: 216px;
    position: absolute;
    left: 0px;

    .btn {
      width: 200px;
      height: 36px;
      min-height: unset;
      background-color: transparent;
      border: none;
      box-shadow: initial;
    }
  }

  .comphb-theme-controller {
    position: absolute;
    right: 68px;
  }
  .comphb-avatar-pos {
    position: absolute;
    right: 10px;
  }
}
</style>
