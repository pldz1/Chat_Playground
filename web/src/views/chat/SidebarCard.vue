<template>
  <div class="chat-sidebar-container">
    <!-- 具体下滑内容 -->

    <el-scrollbar class="chats">
      <!-- chat history list -->
      <div v-for="item in chatNameList" :key="item">
        <el-input
          v-if="item.chatCid == isEditChatCid"
          class="chat-item-input"
          v-model="editChatName"
          placeholder="使用Enter键确认..."
          @keyup.enter="handleEditChatName"
        ></el-input>
        <!-- chat item -->
        <el-button
          v-else
          @click="onLoadHistory(item)"
          :class="['chat-item', { 'selected-chat-item': chatCid === item.chatCid }]"
        >
          <!-- chat item label -->
          <el-text class="truncated-text" :tag="chatCid === item.chatCid ? 'b' : 'span'">{{ item.chatName }}</el-text>
          <!-- chat item options -->
          <OptionDropdown @click.stop :id="item.chatCid" :data="optionData" @on-update="onChatOperation" />
        </el-button>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, ref } from "vue";

import OptionDropdown from "@/components/OptionDropdown.vue";

import { showMessageBox } from "@/utils/custom-message.js";
import { editChatNameByCid, deletChatByCid, downloadChat } from "@/services/chat/common.js";
import { downloadIcon, editIcon, deleteIcon } from "@/assets/image/chat-opt-svgs.js";

const store = useStore();
const chatCid = computed(() => store.state.chat.chatCid);
const chatNameList = computed(() => store.state.chat.chatNameList);

const isEditChatCid = ref("");
const editChatName = ref("");

const optionData = [
  { icon: downloadIcon, opt: "Download" },
  { icon: editIcon, opt: "Edit" },
  { icon: deleteIcon, opt: "Delete" },
];

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
