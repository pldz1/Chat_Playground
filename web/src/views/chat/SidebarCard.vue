<template>
  <div class="chat-sidebar-container" ref="chatSideContRef">
    <div class="csdb-sidebar">
      <!-- 显示 对话(chat) 的列表的头部 -->
      <div class="csdb-chat-list">
        <!-- 展开或者折叠 对话(chat) 列表 -->
        <div class="tooltip tooltip-right" data-tip="展开(关闭)侧边栏">
          <button class="btn csdb-btn-wh1 csdb-btn-color1" @click="onShowSidebar">
            <div v-html="sildbar24"></div>
          </button>
        </div>
        <!-- 新建一个 对话(chat) -->
        <div class="tooltip tooltip-right" data-tip="新建对话">
          <button class="btn csdb-btn-wh1 csdb-btn-color1" @click="onNewChat">
            <div v-html="new24"></div>
          </button>
        </div>
      </div>
      <div class="tooltip tooltip-right" data-tip="设置模型参数">
        <button class="btn csdb-btn-wh1 csdb-btn-color1" @click="onShowModelSettings">
          <div v-html="setting24"></div>
        </button>
      </div>
    </div>
    <!-- 具体下滑内容 -->
    <div v-show="isShowChatScrollbar" class="csdb-chats">
      <div v-if="chatList.length == 0" class="csdb-chats-container">
        <h2 class="font-bold">
          无对话列表
          <br />
          <div v-html="wao128"></div>
        </h2>
      </div>
      <!-- chat history list -->
      <div v-else class="csdb-chats-container">
        <div v-for="item in chatList" :key="item">
          <input
            v-if="isShowOptionCid == item.cid && isEditChatName"
            v-model="editChatName"
            @blur="changeChatName"
            @keydown.enter="changeChatName"
            type="text"
            class="input input-bordered"
            ref="editChatNameInputElRef"
          />
          <!-- 对话的单元 -->
          <div v-else :class="['csdb-chat-item', { 'csdb-chat-item-active': cid === item.cid }]">
            <!-- 对话标签 -->
            <span class="csdb-chat-label" @click="onSelectChat(item)"> {{ item.cname }} </span>
            <div class="tooltip tooltip-bottom" data-tip="其他操作">
              <div class="csdb-chat-dropdown">
                <button class="btn" @click="showChatOptions($event, item.cid)"><div v-html="options24"></div></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 对话选项放在外侧,不被 chats 的尺寸限制住 -->
      <ul v-show="isShowChatOptions" ref="dropdownRef" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li @click="onEditChatName">
          <a
            ><div v-html="edit24"></div>
            编辑对话名称</a
          >
        </li>
        <li @click="onDeleteChat">
          <a
            ><div v-html="delete24"></div>
            删除对话</a
          >
        </li>
      </ul>
    </div>
  </div>
  <ChatSettings></ChatSettings>
</template>

<script setup>
import { useStore } from "vuex";
import { nextTick, ref, computed, onMounted, onUnmounted } from "vue";
import { edit24, delete24, options24, sildbar24, new24, setting24, wao128 } from "@/assets/svg";
import { deleteChat, renameChat, getChatSettings } from "@/services";
import { defChatModelSettings } from "@/constants";
import ChatSettings from "./ChatSettings.vue";
import { dsAlert } from "@/utils";

const store = useStore();
const cid = computed(() => store.state.curChatId);
const chatSideContRef = ref(null);

const chatList = computed(() => {
  return [...store.state.chatList].reverse();
});

const dropdownRef = ref(null);
const isShowChatOptions = ref(false);
const isShowOptionCid = ref("");
const isEditChatName = ref(false);
const editChatName = ref("");
const editChatNameInputElRef = ref(null);
const isShowChatScrollbar = ref(false);
const curChatModel = computed(() => store.state.curChatModel);

/**
 * 回是否开关侧边栏的布尔量
 *  */
const onShowSidebar = () => {
  isShowChatScrollbar.value = !isShowChatScrollbar.value;
};

/**
 * 新建对话
 *  */
const onNewChat = async () => {
  store.dispatch("setCurChatModelSettings", structuredClone(defChatModelSettings));
  await store.dispatch("setCurChatId", "");
  await store.dispatch("resetMessages");
};

/**
 * 打开模型设置界面
 */
const onShowModelSettings = () => {
  if (!curChatModel.value.name) {
    dsAlert({ type: "warn", message: "请先选择模型" });
    return;
  } else global_chat_model_settings.showModal();
};

/**
 * 选择对话
 */
const onSelectChat = async (item) => {
  if (item.cid == cid.value) return;
  await store.dispatch("setCurChatId", item.cid);
  await store.dispatch("resetMessages");
  await getChatSettings();
};

/**
 * 删除对话
 */
const onDeleteChat = async () => {
  if (isShowOptionCid.value) await deleteChat(isShowOptionCid.value);
  if (isShowOptionCid.value == cid.value) {
    await store.dispatch("setCurChatId", "");
  }
  isShowOptionCid.value = "";
  editChatName.value = "";
  isShowChatOptions.value = false;
};

/**
 * 修改对话名称
 */
const onEditChatName = async () => {
  isEditChatName.value = true;
  editChatName.value = "";
  await nextTick();
  if (editChatNameInputElRef?.value[0]) editChatNameInputElRef.value[0].focus();
};

/**
 * 修改对话名称
 */
const changeChatName = async () => {
  if (editChatName.value) await renameChat(isShowOptionCid.value, editChatName.value);
  await nextTick();
  isEditChatName.value = false;
  editChatName.value = "";
  isShowOptionCid.value = "";
};

/**
 * 处理显示点击对话编辑按钮的下拉菜单显示
 */
const showChatOptions = async (event, cid) => {
  event.stopPropagation();
  isShowChatOptions.value = true;
  // 等待 DOM 更新后计算位置
  await nextTick();
  const btnRect = event.currentTarget.getBoundingClientRect();

  const dropdownEl = dropdownRef.value;
  if (dropdownEl && chatSideContRef.value) {
    dropdownEl.style.position = "absolute";
    // 将 dropdown 放置在按钮下方 由于有header的48像素导致这个减去48最合理
    const containerRect = chatSideContRef.value.getBoundingClientRect();
    let top = btnRect.bottom - 48;
    if (top + 88 > containerRect.height) top = containerRect.height - 100;
    dropdownEl.style.top = `${top}px`;
    dropdownEl.style.left = `${btnRect.left}px`;
    dropdownEl.style.zIndex = 301;
  }

  isShowOptionCid.value = cid;
};

/**
 * 关闭下拉菜单的显示
 */
const handleHiddenDropDownClick = () => {
  isShowChatOptions.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleHiddenDropDownClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleHiddenDropDownClick);
});
</script>

<style lang="scss" scoped>
.chat-sidebar-container {
  height: 100%;
  max-height: 100%;
  background-color: oklch(var(--b2) / 0.2);
  display: flex;
  flex-direction: row;

  .csdb-sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px;
    width: 60px;
    max-width: 60px;

    .csdb-btn-color1 {
      background-color: transparent;
      box-shadow: initial;
      border-color: transparent;

      &:hover {
        background-color: oklch(var(--b1));
      }
    }

    .csdb-btn-wh1 {
      height: 32px;
      width: 32px;
      min-height: 32px;
    }

    .csdb-chat-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
  }

  .csdb-chats {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px;
    width: 232px;
    max-width: 232px;

    .csdb-chats-container {
      background-color: oklch(var(--b2) / 0.1);
      height: 100%;
      width: 224px;
      text-align: center;
      max-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;

      h2 {
        display: flex;
        align-items: center;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
      }
    }

    .input {
      height: 36px;

      &:focus,
      &:focus-within {
        border-color: unset;
        outline: none;
      }
    }

    .csdb-chat-item-input {
      height: 36px;
      width: 206px;
      max-width: 208px;
      border: none;
      border-radius: 10px;
      background-color: transparent;
    }

    .csdb-chat-item {
      height: 36px;
      min-height: 36px;
      width: 208px;
      border: none;
      border-radius: 10px;
      background-color: transparent;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      color: oklch(var(--bc));
      margin-bottom: 4px;

      &:hover {
        background-color: oklch(var(--b2));
      }
    }

    .csdb-chat-item-active {
      background-color: oklch(var(--b3));
      font-weight: 900;
      font-size: 16px;
    }

    .csdb-chat-label {
      width: 162px;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .csdb-chat-dropdown {
      .btn {
        height: 36px;
        width: 36px;
        min-height: 0px;
        min-width: 0px;
        background-color: transparent;
        border: none;
        box-shadow: initial;
      }
    }
  }
}
</style>
