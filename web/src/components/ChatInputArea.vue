<template>
  <div class="component-chat-input-area" id="component-chat-input-area">
    <div class="ccia-input-card">
      <div class="ccia-input-area">
        <div class="ccia-imgs-area" id="ccia-chat-input-imgs"></div>
        <textarea
          ref="cciaTextareaRef"
          v-model="inputText"
          class="textarea ccia-custom-textarea"
          placeholder="请输入对话内容"
          @input="debounceInputText"
          @keydown.enter="onEnterKeydown"
        ></textarea>
      </div>

      <div class="ccia-input-opts">
        <!-- 丰富对话功能 -->
        <div class="ccia-chat-opts">
          <!-- 上传图片 -->
          <div class="tooltip tooltip-top" data-tip="上传图片">
            <button class="ccia-opts-button" @click="uploadImageFile">
              <div class="ccia-icon" v-html="attach24"></div>
            </button>
          </div>
          <!-- 对话 -->
          <div v-if="false" class="tooltip tooltip-top" data-tip="网页对话(预览功能)">
            <button class="ccia-opts-button">
              <div class="ccia-icon" v-html="realTimeVoice24"></div>
            </button>
          </div>
        </div>

        <!-- 对话内容的发送或者暂停按钮位置 -->
        <div class="ccia-chat-model-info">
          <select class="select" v-model="selectedModel" @change="onSelectChatModel">
            <option disabled :value="null">选择对话模型</option>
            <option v-for="m in chatModels" :key="m" :value="m">{{ m.name }}</option>
          </select>

          <div class="ccia-chat-button">
            <div class="tooltip tooltip-top" data-tip="开始/暂停">
              <button class="ccia-send-button" @click="onSendInputData">
                <!-- send chat button -->
                <div v-if="!props.isChatting" class="ccia-svg-icon" v-html="arrowUp32"></div>
                <!-- pause chat button -->
                <div v-else class="ccia-svg-icon" v-html="pause32"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { dalle24, realTimeVoice24, attach24, arrowUp32, pause32 } from "@/assets/svg";
import { addPasteEvent, removePasetEvent, uploadImageFile, isValidUserMsg, dsAlert } from "@/utils";
import { packUserMsg } from "@/services";
import { debounce } from "@/utils";

const props = defineProps({
  isChatting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["on-start", "on-stop"]);
const inputText = ref("");
const cciaTextareaRef = ref(null);

/**
 * 这些都是用于显示模型的标签的数据
 */
const store = useStore();
const chatModels = computed(() => store.state.models.chat);
const curChatModel = computed(() => store.state.curChatModel);
const selectedModel = ref(null);

/**
 * 监听当前模型的标签
 */
watch(
  () => curChatModel.value,
  async (newVal) => {
    selectedModel.value = { ...newVal };
  },
  { deep: true },
);

/**
 * 选择当前的对话模型
 */
const onSelectChatModel = async () => {
  store.dispatch("setCurChatModel", selectedModel.value);
};

/**
 * 发送有效的问题, 或者是暂停对话
 */
const onSendInputData = async () => {
  if (props.isChatting) {
    emit("on-stop");
    return;
  }

  const data = packUserMsg("ccia-chat-input-imgs", inputText.value);
  const flag = isValidUserMsg(data);
  if (flag) {
    inputText.value = "";
    emit("on-start", data);

    // 输入框回退原来大小
    onInputText();
  } else {
    dsAlert({ type: "error", message: "没有输入有效的问题!" });
    return;
  }
};

/**
 * 监听输入的内容, 动态的调整输入框的大小, 是一个 workaround, 但是能满足场景
 */
const onInputText = async () => {
  if (cciaTextareaRef.value) {
    cciaTextareaRef.value.style.height = "auto";
    cciaTextareaRef.value.style.height = `${cciaTextareaRef.value.scrollHeight}px`;
  }
};

/**
 * 加入防抖的操作, 节约一点点的资源
 */
const debounceInputText = debounce(onInputText, 50);

/**
 * 输入框的按键组合键
 *  */
const onEnterKeydown = async (event) => {
  // Enter 和 Shift 键表示换行的操作
  if (event.key === "Enter" && !event.shiftKey) {
    // 阻止默认行为（换行）并发送内容
    event.preventDefault();
    await onSendInputData();
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
    border: 1px solid oklch(var(--bc) / 0.5);

    .ccia-custom-textarea {
      padding: 8px 0px 4px 0px;
      border: none;
      outline: none;
      background-color: oklch(var(--b2));
      resize: none;
      box-shadow: initial;
      border-radius: initial;
      min-height: 54px;
      max-height: 208px;
      line-height: 1.5;
      font-size: 14px;
    }

    .ccia-chat-model-info {
      height: 36px;
      width: 320px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      .select {
        height: 36px;
        min-width: 0px;
        min-height: 0px;
        width: fit-content;
        border-radius: 36px;
        border: 1px solid oklch(var(--bc) / 0.2);
        background-color: transparent;
        text-align: center;
      }

      .ccia-chat-button {
        margin-left: 8px;
      }
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
          color: oklch(var(--bc));
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
