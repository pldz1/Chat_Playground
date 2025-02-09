<template>
  <div class="chat-sidebar-container">
    <!-- 具体下滑内容 -->
    <div class="chats">
      <!-- chat history list -->
      <div v-for="item in chatNameList" :key="item">
        <el-input
          v-if="item.chatCid == isEditChatCid"
          class="chat-item-input"
          v-model="editChatName"
          placeholder="使用Enter键确认..."
          @keyup.enter="handleEditChatName"
        ></el-input>
        <!-- 对话的单元 -->
        <div v-else class="chat-item">
          <!-- 对话标签 -->
          <span class="chat-label" @click="onLoadHistory(item)"> {{ item.chatName }} </span>
          <div class="chat-dropdown">
            <button role="button" class="btn" @click="showChatOptions"><div v-html="optionsIcon"></div></button>
          </div>
        </div>
      </div>
    </div>

    <!-- 对话选项 -->
    <ul v-if="isShowChatOptions" id="global-chat-options" tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      <li>
        <a
          ><div v-html="editIcon"></div>
          编辑对话名称</a
        >
      </li>
      <li>
        <a
          ><div v-html="downloadIcon"></div>
          下载对话</a
        >
      </li>
      <li>
        <a
          ><div v-html="deleteIcon"></div>
          删除对话</a
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, ref } from "vue";

import {} from "@/assets/image/chat-opt-svgs.js";

import { showMessageBox } from "@/utils/custom-message.js";
import { editChatNameByCid, deletChatByCid, downloadChat } from "@/services/chat/common.js";
import { downloadIcon, editIcon, deleteIcon, optionsIcon } from "@/assets/image/chat-opt-svgs.js";

const store = useStore();
const chatCid = ref("1123");
const chatNameList = ref([
  { chatCid: "1123", chatName: "hellowrodl" },
  { chatCid: "11234", chatName: "vscode" },
  { chatCid: "1123", chatName: "hellowrodl" },
  { chatCid: "11234", chatName: "vscode" },
  { chatCid: "1123", chatName: "hellowrodl" },
  { chatCid: "11234", chatName: "vscode" },
]);

const isShowChatOptions = ref(false);
const isEditChatCid = ref("");
const editChatName = ref("");

const showChatOptions = (event) => {
  event.stopPropagation();
  // const el = document.getElementById('global-chat-options')
};

/** 回调函数触发的对 chat 的操作 */
const onChatOperation = async (id, opt) => {
  if (opt === "Delete") await deletChatByCid(id);
  if (opt === "Download") await downloadChat(id);
  // 点击 Edit 对话后记录要修改名称的对话的 chatCid 并且让它显示成文本编辑框
  if (opt === "Edit") isEditChatCid.value = id;
};

/** onLoadHistory 向父组件发送加载对话的信号，并返回对话的chatCid */
const onLoadHistory = async (item) => {
  if (item.chatCid == chatCid.value) return;
  var flag = await showMessageBox("你想继续这个对话吗?");
  if (!flag) return;
  // 高亮显示当前对话
  store.commit("SET_CHATCID", item.chatCid);
};

/** handleEditChatName 用键盘的enter表示确认修改对话名称 */
const handleEditChatName = async () => {
  await editChatNameByCid(isEditChatCid.value, editChatName.value);
  isEditChatCid.value = "";
  editChatName.value = "";
};
</script>

<style lang="scss" scoped>
.chat-sidebar-container {
  height: 100%;
  max-height: 100%;
  background-color: oklch(var(--b1));

  .chats {
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    overflow-x: hidden;
    width: 232px;
    max-width: 232px;

    .chat-item-input {
      height: 36px;
      width: 206px;
      max-width: 208px;
      border: none;
      border-radius: 10px;
      background-color: transparent;
    }

    .chat-item {
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

      &:hover {
        background-color: oklch(var(--b2));
      }
      &:active {
        background-color: oklch(var(--b3));
      }
    }

    .chat-label {
      width: 136px;
      text-align: left;
    }

    .chat-dropdown {
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

    .selected-chat-item {
      height: 36px;
      width: 200px;
      border-radius: 10px;
      border: none;
      background-color: #ececec;
    }

    .truncated-text {
      display: flex;
      align-items: center;
      height: 20px;
      width: 160px;
      max-width: 160px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    }
  }
}
</style>

<style lang="scss" scoped>
#global-chat-options {
  position: absolute;
}
</style>
