<template>
  <div class="component-header-bar">
    <!-- 导航菜单 -->
    <div class="tooltip tooltip-right comphb-menu" data-tip="导航菜单">
      <div class="dropdown dropdown-bottom">
        <div tabindex="0" role="button" class="btn btn-square" v-html="menu32"></div>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow">
          <li><a> API笔记</a></li>
          <li><a> 对话界面 </a></li>
          <li><a> 图像界面 </a></li>
        </ul>
      </div>
    </div>

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
import { app32, menu32 } from "@/assets/svg";
import ThemeController from "@/components/ThemeController.vue";
import AvatarCard from "@/components/AvatarCard.vue";
import UserSettings from "@/views/user/UserSettings.vue";

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

  .comphb-menu {
    position: absolute;
    left: 8px;

    .btn {
      background-color: transparent;
      border: none;
    }

    .dropdown-content {
      width: 122px;
    }
  }

  .comphb-home {
    width: 216px;
    position: absolute;
    left: 48px;

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
