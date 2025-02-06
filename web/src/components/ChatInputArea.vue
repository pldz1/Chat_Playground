<template>
  <div class="component-chat-input-area" id="component-chat-input-area">
    <div class="input-card">
      <div class="input-area">
        <div class="imgs" id="chat-input-imgs"></div>
        <el-input
          v-model="inputText"
          class="custom-textarea"
          type="textarea"
          placeholder="Please input your question ..."
          :autosize="{ minRows: 1, maxRows: 4 }"
          @keydown.enter="onEnterKeydown"
        ></el-input>
      </div>

      <div class="input-opts">
        <!-- 丰富对话功能 -->
        <div class="chat-opts">
          <el-button class="opts-button" @click="uploadImageFile">
            <div class="icon" v-html="chatAttachIcon"></div>
          </el-button>
          <el-button class="opts-button">
            <div class="icon" v-html="dalle3Icon"></div>
          </el-button>
          <el-button class="opts-button">
            <div class="icon" v-html="realTimeVoiceIcon"></div>
          </el-button>
        </div>

        <!-- 对话内容的发送或者暂停按钮位置 -->
        <div class="chat-button">
          <el-button class="send-button">
            <!-- send chat button -->
            <div v-if="!props.isChatting" :class="['svg-icon', { 'svg-icon-disable': inputText == '' }]" v-html="sendIcon"></div>
            <!-- pause chat button -->
            <div v-else class="svg-icon" v-html="pauseIcon"></div>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted, onBeforeUnmount } from "vue";
import { dalle3Icon, realTimeVoiceIcon, chatAttachIcon, sendIcon, pauseIcon } from "@/assets/image/chat-inputarea-svgs.js";
import { addPasteEvent, removePasetEvent, uploadImageFile } from "@/services/user/files.js";

const props = defineProps({
  isChatting: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits("on-send");
const inputText = ref("");

/** 输入框的按键组合键 */
const onEnterKeydown = async (event) => {
  // Enter 和 Shift 键表示换行的操作
  if (event.key === "Enter" && !event.shiftKey) {
    // 阻止默认行为（换行）并发送内容
    event.preventDefault();
    emit("on-send", inputText.value);
    inputText.value = "";
  }
};

onMounted(() => {
  addPasteEvent("component-chat-input-area");
});

onBeforeUnmount(() => {
  removePasetEvent("component-chat-input-area");
});
</script>
