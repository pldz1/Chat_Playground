<template>
  <div class="component-header-bar">
    <!-- 显示 对话(chat) 的列表的头部 -->
    <div class="comphb-chat-list" id="component-header-bar-chat-list">
      <!-- 展开或者折叠 对话(chat) 列表 -->
      <div class="tooltip tooltip-right" data-tip="展开(关闭)侧边栏">
        <button class="btn comphb-btn-wh1 comphb-btn-color1" @click="onShowSidebar">
          <div v-html="sildbarIcon"></div>
        </button>
      </div>
      <!-- 新建一个 对话(chat) -->
      <div class="tooltip tooltip-bottom" data-tip="新建对话">
        <button class="btn comphb-btn-wh1 comphb-btn-color1" @click="onNewChat">
          <div v-html="newChatIcon"></div>
        </button>
      </div>
    </div>

    <!-- 对话模型信息 -->
    <div class="comphb-chat-model-info">
      <!-- <ChatModelDropdown></ChatModelDropdown> -->
      <select class="select select-bordered w-full max-w-xs" v-model="currentChatModel">
        <option v-for="model in chatModels" :key="model.name">{{ model.name }}</option>
      </select>
      <div class="tooltip tooltip-bottom" data-tip="设置模型参数">
        <button class="btn comphb-btn-wh1 comphb-btn-color1" @click="onShowSettings">
          <div v-html="settingsIcon"></div>
        </button>
      </div>
    </div>
    <!-- 控制主题 -->
    <ThemeController class="comphb-theme-controller"></ThemeController>
    <!-- 用户管理界面 -->
    <AvatarCard class="comphb-avatar-pos" onclick="global_user_setting.showModal()"></AvatarCard>
    <UserSettings></UserSettings>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import ThemeController from "@/components/ThemeController.vue";
import AvatarCard from "@/components/AvatarCard.vue";
import UserSettings from "../user/UserSettings.vue";

import { sildbarIcon, newChatIcon, settingsIcon } from "@/assets/image/chat-svgs.js";

const store = useStore();
const chatModels = computed(() => store.state.user.chatModels);
const currentChatModel = computed(() => chatModels.value[0] || null);

const emits = defineEmits(["on-show-chat-list"]);

/** onShowSidebar 向父组件发送显示或者隐藏侧边栏的信号, 返回是否开关侧边栏的布尔量 */
const onShowSidebar = () => {
  const chatListEl = document.getElementById("component-header-bar-chat-list");
  const chatCardEl = document.getElementById("global-chat-card");
  if (chatListEl.style.justifyContent === "flex-start") {
    chatListEl.style.justifyContent = "space-between";
    chatListEl.style.width = "216px";
    if (chatCardEl) chatCardEl.style.width = "calc(100% - 232px)";
    emits("on-show-chat-list", true);
  } else {
    chatListEl.style.justifyContent = "flex-start";
    chatListEl.style.width = "fit-content";
    if (chatCardEl) chatCardEl.style.width = "100%";
    emits("on-show-chat-list", false);
  }
};

/** onNewChat 向父组件发送要新建对话的信号 */
const onNewChat = () => {};

/** 显示对话的编辑弹窗 chat-settings-overlay */
const onShowSettings = () => {};

const onShowUserSettingOverlay = () => {};
</script>

<style lang="scss" scoped>
.component-header-bar {
  position: relative;
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 100%;
  max-height: 48px;
  background-color: oklch(var(--b1));

  display: flex;
  flex-direction: row;
  align-items: center;

  .comphb-btn-color1 {
    background-color: oklch(var(--b1));
    box-shadow: initial;
    border-color: transparent;

    &:hover {
      background-color: oklch(var(--b2));
    }
  }

  .comphb-btn-wh1 {
    height: 32px;
    width: 32px;
    min-height: 32px;
  }

  .comphb-chat-list {
    position: relative;
    height: 36px;
    width: 216px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    margin-left: 8px;
  }

  .comphb-theme-controller {
    position: absolute;
    right: 68px;
  }
  .comphb-avatar-pos {
    position: absolute;
    right: 10px;
  }

  .comphb-chat-model-info {
    position: relative;
    height: 36px;
    width: 320px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    .select {
      width: 268px;
      height: 36px;
      min-width: 0px;
      min-height: 0px;
    }
  }
}
</style>
