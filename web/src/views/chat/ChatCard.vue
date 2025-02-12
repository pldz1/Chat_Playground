<template>
  <div class="chat-card-container">
    <!-- 显示markdown的问答区域 -->
    <div class="ccdc-messages-container" ref="scrollbarRef">
      <div id="chat-messages-container" class="cccd-scroll-window" ref="innerRef"></div>
    </div>
    <!-- 输入问题 -->
    <div class="cccd-input-area">
      <ChatInputArea :is-chatting="isChatting" @on-update="onSendContent"></ChatInputArea>
    </div>
  </div>
</template>

<script setup>
import chatCardHandler from "@/services/chat/card.js";
import ChatInputArea from "@/components/ChatInputArea.vue";

import { useStore } from "vuex";
import { ref, watch, nextTick, computed, onMounted } from "vue";
import { AIGCClient, ChatDrawer } from "@/services";

const store = useStore();

const isChatting = ref(false);
const isShowRoleCard = ref(true);

const scrollbarRef = ref();
const innerRef = ref();

const client = new AIGCClient("chat");
const drawer = new ChatDrawer(false);
const curChatModel = computed(() => store.state.user.curChatModel);

watch(
  () => curChatModel.value,
  () => {
    client.init();
  },
  { deep: true, immediate: true },
);

watch(
  () => store.state.chat.chatCid,
  async (value) => {
    if (value !== "") {
      isShowRoleCard.value = false;
    } else {
      isShowRoleCard.value = true;
    }
  },
);

/** 向服务器发送数据 */
const onSendContent = async (value) => {
  drawer.draw([{ role: "user", content: [{ type: "text", text: "Hello?" }] }]);
  // await client.chat([{ role: "user", content: [{ type: "text", text: "Hello?" }] }]);

  // if (isChatting.value) {
  //   const flag = await showMessageBox("取消继续生成对话吗?");
  //   if (flag) {
  //     chatCardHandler.stopChat();
  //     isChatting.value = false;
  //   }
  //   return;
  // }

  // // 及时清空对话框
  // var msg = value;
  // if (msg == "") {
  //   showMessage("warning", "输入正确的问题");
  //   return;
  // }

  // // 请求API
  // isChatting.value = true;

  // await chatCardHandler.sendChat(msg, setScrollToBottom);
  // isChatting.value = false;
  // chatCardHandler.addListener();
};

/**
 * 默认显示最新的内容，拖拉条滚动到最底部
 * Element-plus 如何让滚动条永远在最底部（支持在线演示）
 * https://blog.csdn.net/qq_42203909/article/details/133816286
 */
const setScrollToBottom = async () => {
  await nextTick();
  const max = innerRef.value.clientHeight;
  scrollbarRef.value.setScrollTop(max);
};

const setScrollToTop = async () => {
  await nextTick();
  scrollbarRef.value.setScrollTop(0);
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

  .ccdc-messages-container {
    position: absolute;
    left: 10%;
    width: 80%;
    max-width: 80%;
    height: calc(100% - 148px);
    z-index: 100;
  }

  .cccd-scroll-window {
    width: 100%;
    height: 100%;
    max-height: 100%;

    .user {
      display: flex;
      flex-direction: row-reverse;
      width: 100%;
      height: auto;
      min-height: 40px;
      border-radius: 32px;
      margin: 4px 0px;

      .user-content {
        max-width: 60%;
        min-width: 30%;
        width: fit-content;
        color: #0d0d0d;
        display: flex;
        flex-direction: column;

        .content-area,
        .options {
          padding: 8px 16px;
          width: calc(100% - 45px);
        }

        .content-area {
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          padding: 8px 16px;
          background-color: #f4f4f4;

          .img-area {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: row;
            gap: 16px;
            flex-wrap: wrap;
            margin-bottom: 8px;

            .item {
              height: 80px;
              width: 80px;
              object-fit: contain;
            }
          }

          .text {
            width: 100%;
            font-size: 14px;
            color: black;
            word-wrap: break-word;
          }
        }

        .options {
          border-radius: 16px;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          height: 24px;
        }
      }
    }

    .options-button {
      display: none;
      &.active {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background-color: transparent;
        border: none;
        border-radius: 12px;
        &:hover {
          background-color: #939393;
        }
        &:active {
          background-color: #939393;
        }
      }
    }
    .options-icon {
      color: #4d4d4d;
      background-color: transparent;
      width: 16px;
      height: 16px;
    }

    .assistant {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: auto;
      min-height: 40px;
      border-radius: 32px;

      .assistant-icon {
        color: black;
        background-color: transparent;
        border-radius: 16px;
      }

      .assistant-content {
        width: calc(100% - 60px);
        max-width: calc(100% - 60px);
        border-radius: 16px;
        padding: 8px 16px;
        background-color: transparent;
        color: #0d0d0d;

        .options {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          width: 100%;
          height: 24px;
        }
      }
    }
  }

  .cccd-input-area {
    position: absolute;
    bottom: 10px;
    left: 10%;
    width: 80%;
    max-width: 80%;
    z-index: 101;
  }
}
</style>
