<template>
  <div class="component-chat-input-area" id="component-chat-input-area">
    <div class="input-card">
      <div class="input-area">
        <div class="imgs" id="chat-input-imgs"></div>
        <textarea
          v-model="inputText"
          class="textarea custom-textarea"
          type="textarea"
          placeholder="Please input your question ..."
          :autosize="{ minRows: 1, maxRows: 4 }"
          @keydown.enter="onEnterKeydown"
        ></textarea>
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
import { ref, onMounted, onBeforeUnmount } from "vue";
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

<style lang="scss" scoped>
.component-chat-input-area {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;

  .input-card {
    width: calc(100% - 40px);
    background-color: #f4f4f4;
    border-radius: 50px;
    padding: 8px 20px;

    .send-button {
      height: 32;
      width: 32;
      border-radius: 16px;
      background-color: transparent;
      border: none;
    }

    .input-area {
      width: 100%;
      min-height: 31px;
      height: auto;
      display: flex;
      flex-direction: column;

      .imgs {
        display: flex;
        flex-direction: row;
        max-height: 60px;
        gap: 6px;
        overflow-y: hidden;
        overflow-x: auto;

        &::-webkit-scrollbar {
          height: 8px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #aaa;
          border-radius: 4px;
        }

        &::-webkit-scrollbar-track {
          background-color: #f0f0f0;
        }

        &::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
          background: transparent;
        }

        .item {
          height: 50px;
          width: 50px;

          .image {
            height: 50px;
            width: 50px;
            object-fit: contain;
          }

          .hover-item {
            display: none;
            position: absolute;

            .hover-button {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 50px;
              width: 50px;
            }
          }

          &:hover {
            .image {
              opacity: 0.7;
            }
            .hover-item {
              display: block;
            }
          }
        }
      }
    }

    .input-opts {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;

      .opts-button {
        height: 32px;
        width: 32px;
        background-color: transparent;
        border: none;
        margin-left: 8px;

        .icon {
          min-width: 32px;
          min-height: 32px;
          max-width: 32px;
          max-height: 32px;
          border-radius: 16px;
          display: flex;
          align-items: center;
        }
      }
    }

    .svg-icon {
      color: white;
      background-color: black;
      min-width: 32px;
      min-height: 32px;
      max-width: 32px;
      max-height: 32px;
      border-radius: 16px;
    }

    .svg-icon-disable {
      color: #f4f4f4;
      background-color: #d7d7d7;
      min-width: 32px;
      min-height: 32px;
      border-radius: 16px;
    }

    .custom-textarea {
      padding: 8px 0px 0px 0px;
      .el-textarea__inner {
        border: none !important;
        outline: none;
        background-color: #f4f4f4;
        resize: none !important;
        box-shadow: initial;
        border-radius: initial;

        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #aaa;
          border-radius: 4px;
        }

        &::-webkit-scrollbar-track {
          background-color: #f0f0f0;
        }

        &::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
          background: transparent;
        }
      }
    }
  }
}
</style>
