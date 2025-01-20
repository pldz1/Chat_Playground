<template>
  <div class="component-chat-input-area" id="component-chat-input-area">
    <div class="input-card">
      <div class="input-area">
        <div class="imgs" id="chat-input-imgs"></div>
        <el-input
          v-model="userQuestionText"
          class="custom-textarea"
          type="textarea"
          placeholder="Please input your question ..."
          :autosize="{ minRows: 1, maxRows: 4 }"
        ></el-input>
      </div>

      <div class="input-opts">
        <!-- 丰富对话功能 -->
        <div class="chat-opts">
          <el-button class="opts-button">
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
            <div
              v-if="!isChatting"
              :class="['svg-icon', { 'svg-icon-disable': userQuestionText == '' }]"
              v-html="sendIcon"
            ></div>
            <!-- pause chat button -->
            <div v-else class="svg-icon" v-html="pauseIcon"></div>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  dalle3Icon,
  realTimeVoiceIcon,
  chatAttachIcon,
  sendIcon,
  pauseIcon,
} from "@/assets/image/chat-inputarea-svgs.js";

const userQuestionText = ref("");
</script>
