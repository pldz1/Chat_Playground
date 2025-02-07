<template>
  <div class="component-header-bar">
    <!-- 显示 对话(chat) 的列表的头部 -->
    <div v-if="props.chatList" class="chat-list" id="component-header-bar-chat-list">
      <!-- 展开或者折叠 对话(chat) 列表 -->
      <div class="tooltip tooltip-right" data-tip="展开(关闭)侧边栏">
        <button class="btn cw" @click="onShowSidebar">
          <div class="svg-icon" v-html="sildbarIcon"></div>
        </button>
      </div>
      <!-- 新建一个 对话(chat) -->
      <div class="tooltip tooltip-right" data-tip="新建对话">
        <button class="btn cw" @click="onNewChat">
          <div class="svg-icon" v-html="newChatIcon"></div>
        </button>
      </div>
    </div>

    <div class="chat-model-info" v-if="props.chatModelInfo">
      <!-- settings -->
      <el-tooltip content="修改当前对话模型参数" placement="bottom" :show-after="500">
        <el-button class="settings" @click="onShowSettings">
          <el-text class="settings-text" :tag="'b'">
            {{ chatParams.modelName }}
          </el-text>
          <div class="settings-icon" v-html="settingsIcon"></div>
        </el-button>
      </el-tooltip>
    </div>
    <div v-if="userConfig" class="user-config" @click="onShowUserSettingOverlay">
      <!-- user info -->
      <el-tooltip content="User management" placement="bottom" :show-after="500">
        <el-button class="user-man">
          <img src="../assets/image/avatar.png" />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import { useStore } from "vuex";

import { sildbarIcon, newChatIcon, settingsIcon } from "@/assets/image/chat-svgs.js";

const emits = defineEmits(["on-show-chat-list"]);
const props = defineProps({
  chatList: {
    type: Boolean,
    default: false,
  },
  chatModelInfo: {
    type: Boolean,
    default: false,
  },
  userConfig: {
    type: Boolean,
    default: true,
  },
});

const store = useStore();
const chatParams = computed(() => store.state.chat.chatParams);

/** onShowSidebar 向父组件发送显示或者隐藏侧边栏的信号, 返回是否开关侧边栏的布尔量 */
const onShowSidebar = () => {
  const chatListEl = document.getElementById("component-header-bar-chat-list");
  const chatCardEl = document.getElementById("global-chat-card");
  if (chatListEl.style.justifyContent === "flex-start") {
    chatListEl.style.backgroundColor = "#f9f9f9";
    chatListEl.style.justifyContent = "space-between";
    chatListEl.style.width = "calc(232px - 16px)";
    if (chatCardEl) chatCardEl.style.width = "calc(100% - 232px)";
    emits("on-show-chat-list", true);
  } else {
    chatListEl.style.justifyContent = "flex-start";
    chatListEl.style.backgroundColor = "transparent";
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
