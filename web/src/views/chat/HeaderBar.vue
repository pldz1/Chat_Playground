<template>
  <div class="component-header-bar">
    <!-- 显示 对话(chat) 的列表的头部 -->
    <div class="comphb-chat-list" id="component-header-bar-chat-list">
      <!-- 展开或者折叠 对话(chat) 列表 -->
      <div class="tooltip tooltip-right" data-tip="展开(关闭)侧边栏">
        <button class="btn comphb-btn-wh1 comphb-btn-color1" @click="onShowSidebar">
          <div v-html="sildbar24"></div>
        </button>
      </div>
      <!-- 新建一个 对话(chat) -->
      <div class="tooltip tooltip-bottom" data-tip="新建对话">
        <button class="btn comphb-btn-wh1 comphb-btn-color1" @click="onNewChat">
          <div v-html="new24"></div>
        </button>
      </div>
    </div>

    <!-- 对话模型信息 -->
    <div class="comphb-chat-model-info">
      <!-- <ChatModelDropdown></ChatModelDropdown> -->
      <select class="select select-bordered w-full max-w-xs" v-model="model" @change="onSelectChatModel">
        <option v-for="model in chatModels" :key="model" :value="model">{{ model.name }}</option>
      </select>
      <div class="tooltip tooltip-bottom" data-tip="设置模型参数">
        <button class="btn comphb-btn-wh1 comphb-btn-color1" onclick="global_chat_model_settings.showModal()">
          <div v-html="setting24"></div>
        </button>
      </div>
    </div>
    <!-- 回到主页标题 -->
    <div class="tooltip tooltip-bottom comphb-home" data-tip="回到主页">
      <button class="btn btn-square">
        <div v-html="app32"></div>
        <span>AIGC Playground</span>
      </button>
    </div>
    <!-- 控制主题 -->
    <ThemeController class="comphb-theme-controller"></ThemeController>
    <!-- 用户管理界面 -->
    <AvatarCard class="comphb-avatar-pos" onclick="global_user_settings.showModal()"></AvatarCard>
    <UserSettings></UserSettings>
    <ChatSettings></ChatSettings>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
import { chatModelSettings_T } from "@/typings";
import { app32, sildbar24, new24, setting24 } from "@/assets/svg";

import ThemeController from "@/components/ThemeController.vue";
import AvatarCard from "@/components/AvatarCard.vue";
import UserSettings from "../user/UserSettings.vue";
import ChatSettings from "./ChatSettings.vue";

const emits = defineEmits(["on-show-chat-list"]);

const store = useStore();
const chatModels = computed(() => store.state.user.chatModels);
const curChatModel = computed(() => store.state.user.curChatModel);
const model = ref(null);

watch(
  () => curChatModel.value,
  async (newVal) => {
    model.value = { ...newVal };
  },
  { deep: true },
);

/**
 * 向父组件发送显示或者隐藏侧边栏的信号, 返回是否开关侧边栏的布尔量
 *  */
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

/**
 * 新建对话
 *  */
const onNewChat = async () => {
  store.dispatch("setCurChatModelSettings", structuredClone(chatModelSettings_T));
  await store.dispatch("setCurChatId", "");
  await store.dispatch("resetMessages");
};

/**
 * 选择当前的对话模型
 */
const onSelectChatModel = async () => {
  store.dispatch("setCurChatModel", model.value);
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
  background-color: oklch(var(--b1));
  z-index: 301;

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

  .comphb-home {
    width: 200px;
    position: absolute;
    right: 186px;

    .btn {
      width: 200px;
      height: 36px;
      min-height: unset;
      background-color: oklch(var(--b1));
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
