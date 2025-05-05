<template>
  <div class="chat-card-container">
    <!-- 显示markdown的问答区域 -->
    <ChatInsTemplate v-show="isShowTemplate" @on-update="onDrawTemplateIns"></ChatInsTemplate>
    <div class="ccdc-messages-container">
      <div id="chat-messages-container" class="cccd-scroll-window" ref="innerRef"></div>
    </div>
    <!-- 输入问题 -->
    <div class="cccd-input-area">
      <ChatInputArea :is-chatting="isChatting" @on-start="onStartChat" @on-stop="onStopChat"></ChatInputArea>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { dsLoading } from "@/utils";
import { ref, watch, computed, onMounted, nextTick } from "vue";
import { ChatDrawer, addChat, getAllMessage } from "@/services";

import ChatInputArea from "@/components/ChatInputArea.vue";
import ChatInsTemplate from "@/views/chat/ChatInsTemplate.vue";

const store = useStore();
const isChatting = ref(false);
const innerRef = ref(null);

const drawer = new ChatDrawer(true);
const curChatModel = computed(() => store.state.curChatModel);
const curChatId = computed(() => store.state.curChatId);
const isShowTemplate = ref(true);

watch(
  () => curChatId.value,
  async (newVal) => {
    dsLoading(true);
    drawer.removeAllElem();
    await nextTick();

    // 判读对话的 id, 来显示不同的内容.
    if (!newVal) {
      // 如果是空的对话 id, 那么就认为是新的对话.
      isShowTemplate.value = true;
    } else {
      isShowTemplate.value = false;
      getAllMessage(drawer.draw);
    }

    dsLoading(false);
  },
);

watch(
  () => curChatModel.value,
  () => {
    drawer.aigcInit();
  },
  { deep: true, immediate: true },
);

/** 向服务器发送数据 */
const onStartChat = async (message) => {
  isShowTemplate.value = false;

  // 新建对话
  if (!curChatId.value) {
    await addChat();
  }
  isChatting.value = true;
  await drawer.chat(message);
  isChatting.value = false;
};

/**
 * 停止接受消息
 * */
const onStopChat = async () => {
  drawer.stop();
  isChatting.value = false;
  // dsAlert({ type: "info", message: "暂时不支持暂停对话." });
};

/**
 * 绘制对话指令的内容, 这个不会放进store
 */
const onDrawTemplateIns = (messages) => {
  drawer.draw(messages);
};

onMounted(() => {
  drawer.init("chat-messages-container");
});
</script>

<style lang="scss" scoped>
.chat-card-container {
  position: relative;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  padding: 8px;

  .ccdc-messages-container,
  .chat-template-display-card,
  .cccd-input-area {
    position: absolute;
    left: 16%;
    width: 68%;
    max-width: 68%;
  }

  .ccdc-messages-container {
    height: calc(100% - 128px);
    z-index: 100;
  }

  .cccd-scroll-window {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .cccd-input-area {
    bottom: 10px;
    z-index: 201;
    display: flex;
    justify-content: center;
  }
}
</style>
