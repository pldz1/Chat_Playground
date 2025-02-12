<template>
  <div class="component-chat-input-area" id="component-chat-input-area">
    <div class="ccia-input-card">
      <div class="ccia-input-area">
        <div class="ccia-imgs-area" id="ccia-chat-input-imgs"></div>
        <textarea
          v-model="inputText"
          class="textarea ccia-custom-textarea"
          placeholder="Please input your question ..."
          @keydown.enter="onEnterKeydown"
        ></textarea>
      </div>

      <div class="ccia-input-opts">
        <!-- 丰富对话功能 -->
        <div class="ccia-chat-opts">
          <el-button class="ccia-opts-button" @click="uploadImageFile">
            <div class="ccia-icon" v-html="attach24"></div>
          </el-button>
          <el-button class="ccia-opts-button">
            <div class="ccia-icon" v-html="dalle24"></div>
          </el-button>
          <el-button class="ccia-opts-button">
            <div class="ccia-icon" v-html="realTimeVoice24"></div>
          </el-button>
        </div>

        <!-- 对话内容的发送或者暂停按钮位置 -->
        <div class="ccia-chat-button">
          <el-button class="ccia-send-button">
            <!-- send chat button -->
            <div v-if="!props.isChatting" :class="['ccia-svg-icon', { 'ccia-svg-icon-disable': inputText == '' }]" v-html="arrowUp32"></div>
            <!-- pause chat button -->
            <div v-else class="ccia-svg-icon" v-html="pause32"></div>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { dalle24, realTimeVoice24, attach24, arrowUp32, pause32 } from "@/assets/svg";
import { addPasteEvent, removePasetEvent, uploadImageFile } from "@/utils";

const props = defineProps({
  isChatting: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["on-update"]);
const inputText = ref("");

/** 输入框的按键组合键 */
const onEnterKeydown = async (event) => {
  // Enter 和 Shift 键表示换行的操作
  if (event.key === "Enter" && !event.shiftKey) {
    // 阻止默认行为（换行）并发送内容
    event.preventDefault();
    emit("on-update", inputText.value);
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

  .ccia-input-card {
    width: calc(100% - 40px);
    background-color: oklch(var(--b2));
    border-radius: 24px;
    padding: 8px 20px;
    min-height: 118px;

    .ccia-custom-textarea {
      padding: 8px 0px 0px 0px;
      border: none;
      outline: none;
      background-color: oklch(var(--b2));
      resize: none;
      box-shadow: initial;
      border-radius: initial;
      min-height: 76px;
    }

    .ccia-send-button {
      height: 32;
      width: 32;
      border-radius: 16px;
      background-color: transparent;
      border: none;
    }

    .ccia-input-area {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
    }

    .ccia-input-opts {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;

      .ccia-opts-button {
        height: 32px;
        width: 32px;
        background-color: transparent;
        border: none;
        margin-left: 8px;

        .ccia-icon {
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

    .ccia-svg-icon {
      color: oklch(var(--bc));
      background-color: oklch(var(--b3));
      min-width: 32px;
      min-height: 32px;
      max-width: 32px;
      max-height: 32px;
      border-radius: 16px;
    }

    .ccia-svg-icon-disable {
      opacity: 0.4;
      min-width: 32px;
      min-height: 32px;
      border-radius: 16px;
    }
  }
}
</style>

<style lang="scss">
.ccia-imgs-area {
  display: flex;
  flex-direction: row;
  max-height: 60px;
  gap: 6px;
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;

  .ccia-item {
    height: 50px;
    width: 50px;
    min-height: 50px;
    min-width: 50px;
    z-index: 1;

    .ccia-image {
      height: 50px;
      width: 50px;
      object-fit: cover;
    }

    .ccia-hover-item {
      display: none;
      position: absolute;
      z-index: 2;

      .ccia-hover-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        width: 50px;
      }
    }

    &:hover {
      .ccia-image {
        opacity: 0.7;
      }

      .ccia-hover-item {
        display: block;
      }
    }
  }
}

.ccia-imgs-area::-webkit-scrollbar {
  height: 4px;
}
</style>
