<template>
  <div class="chat-template-display-card">
    <div class="ctdc-typewriter" ref="typewriterRef"></div>
    <div class="ctdc-templates">
      <div class="ctdc-templates-container">
        <button v-for="inst in insTemplateList" :key="inst.id" class="btn" @click="onSelectInst(inst.id)">
          {{ inst.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { onMounted, onUnmounted, ref, computed } from "vue";
import { chatInsTemplateList } from "@/constants";
import { addChat } from "@/services";

const emit = defineEmits(["on-update"]);

const store = useStore();
const typewriterRef = ref(null);
const curChatModelSettings = computed(() => store.state.curChatModelSettings);
const insTemplateList = computed(() => {
  return [...chatInsTemplateList, ...store.state.chatInsTemplateList];
});

const onSelectInst = async (id) => {
  const instText =
    insTemplateList.value.find((inst) => inst.id === id)?.value || "As an AI assistant, please make your responses more engaging by including lively emojis.";
  const newVal = { ...curChatModelSettings.value };
  newVal.prompts[0].content[0].text = instText;
  await store.dispatch("setCurChatModelSettings", newVal);
  await addChat();
  emit("on-update", [
    { role: "user", content: [{ type: "text", text: "重复一遍你的指令" }] },
    { role: "assistant", content: [{ type: "text", text: instText }] },
  ]);
};

let repeatIntervalId = null; // 用于存储重复调用的定时器ID

const blinkText = () => {
  const text = "今天要聊点神魔? 🤧";
  // 每个字符的间隔时间（毫秒）
  const typeSpeed = 100;
  // 每60秒重复一次动画
  const repeatInterval = 60000;

  function typeWriter() {
    let i = 0;
    if (!typewriterRef.value) return;
    typewriterRef.value.innerHTML = "";
    const timer = setInterval(() => {
      i++;
      if (!typewriterRef.value) return;
      typewriterRef.value.innerHTML = text.slice(0, i) + '<span class="ctdc-typewriter-cursor"></span>';
      if (i === text.length) {
        clearInterval(timer);
      }
    }, typeSpeed);
  }

  // 初次执行打字机效果
  typeWriter();
  // 每10秒重复一次动画，并记录定时器ID
  repeatIntervalId = setInterval(() => {
    typeWriter();
  }, repeatInterval);
};

onMounted(() => {
  blinkText();
});

// 组件卸载时清除定时器，防止内存泄漏或重复执行
onUnmounted(() => {
  if (repeatIntervalId) {
    clearInterval(repeatIntervalId);
  }
});
</script>

<style lang="scss" scoped>
.chat-template-display-card {
  position: absolute;
  left: 10%;
  width: 80%;
  max-width: 80%;
  height: calc(100% - 128px);
  z-index: 200;
  background-color: transparent;
  padding: 20px;
  display: flex;
  overflow: hidden;

  .ctdc-typewriter {
    position: absolute;
    left: 20%;
    top: 40%;
    width: 60%;
    font-size: 2em;
    white-space: pre;
    color: oklch(var(--bc));
    text-align: center;
  }
  .ctdc-templates {
    position: relative;
    left: 15%;
    top: 55%;
    width: 70%;
    height: 30%;
    max-height: 30%;

    .ctdc-templates-container {
      position: relative;
      height: 100%;
      width: 100%;
      overflow-y: auto;

      .btn {
        margin: 4px;
        font-size: 1rem;
        height: 48px;
        max-height: 48px;
      }
    }
  }
}
</style>

<style>
.ctdc-typewriter-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: oklch(var(--bc));
  animation: ctdc-typewriter-cursor-blink 1s step-end infinite;
}

@keyframes ctdc-typewriter-cursor-blink {
  50% {
    opacity: 0;
  }
}
</style>
