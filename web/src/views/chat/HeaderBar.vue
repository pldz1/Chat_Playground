<template>
  <div class="component-header-bar">
    <!-- 显示 对话(chat) 的列表的头部 -->
    <div class="chat-list" id="component-header-bar-chat-list">
      <!-- 展开或者折叠 对话(chat) 列表 -->
      <div class="tooltip tooltip-right" data-tip="展开(关闭)侧边栏">
        <button class="btn btn-wh1 btn-color1" @click="onShowSidebar">
          <div class="svg-icon" v-html="sildbarIcon"></div>
        </button>
      </div>
      <!-- 新建一个 对话(chat) -->
      <div class="tooltip tooltip-right" data-tip="新建对话">
        <button class="btn btn-wh1 btn-color1" @click="onNewChat">
          <div class="svg-icon" v-html="newChatIcon"></div>
        </button>
      </div>
    </div>

    <!-- 对话模型信息 -->
    <div class="chat-model-info">
      <ChatModelDropdown></ChatModelDropdown>
      <div class="tooltip tooltip-right" data-tip="设置模型参数">
        <button class="btn btn-wh1 btn-color1" @click="onShowSettings">
          <div class="svg-icon" v-html="settingsIcon"></div>
        </button>
      </div>
    </div>
    <!-- 控制主题 -->
    <ThemeController class="theme-controller"></ThemeController>
    <!-- 用户管理界面 -->
    <AvatarCard class="avatar-pos"></AvatarCard>
  </div>
</template>

<script setup>
import { defineEmits, computed } from "vue";
import { useStore } from "vuex";

import ChatModelDropdown from "@/components/ChatModelDropdown.vue";
import ThemeController from "@/components/ThemeController.vue";
import AvatarCard from "@/components/AvatarCard.vue";

import { sildbarIcon, newChatIcon, settingsIcon } from "@/assets/image/chat-svgs.js";

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
const onNewChat = () => {
  store.commit("SET_CHATCID", "");
};

/** 显示对话的编辑弹窗 chat-settings-overlay */
const onShowSettings = () => {
  store.commit("SET_CHAT_SHOWSETTINGUI", true);
};

const onShowUserSettingOverlay = () => {
  store.commit("SET_USER_SHOWSETTINGUI", true);
};
</script>

<style lang="scss" scoped>
.component-header-bar {
  position: relative;
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 48px;
  max-height: 48px;
  background-color: oklch(var(--b1));

  display: flex;
  flex-direction: row;
  align-items: center;

  .btn-color1 {
    background-color: oklch(var(--b1));
    box-shadow: initial;
    border-color: transparent;

    &:hover {
      background-color: oklch(var(--b2));
    }
  }

  .btn-wh1 {
    height: 32px;
    width: 32px;
    min-height: 32px;
  }

  .chat-list {
    position: relative;
    height: 36px;
    width: 216px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    margin-left: 8px;
  }

  .theme-controller {
    position: absolute;
    right: 68px;
  }
  .avatar-pos {
    position: absolute;
    right: 10px;
  }

  .chat-model-info {
    position: relative;
    height: 36px;
    width: 240px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
</style>
