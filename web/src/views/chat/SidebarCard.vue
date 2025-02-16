<template>
  <div class="chat-sidebar-container">
    <!-- 具体下滑内容 -->
    <div class="csdb-chats">
      <div v-if="chatList.length == 0" class="csdb-chats-container">
        <h2 class="font-bold">
          无对话列表
          <br />
          <img loading="lazy" width="72" height="72" src="/yawning-face@80.webp" class="pointer-events-none inline-block h-[5em] w-[5em] align-bottom" />
        </h2>
      </div>
      <!-- chat history list -->
      <div v-else class="csdb-chats-container">
        <div v-for="item in chatList" :key="item">
          <input v-if="isEditChatName" v-model="editChatName" @change="changeChatName" type="text" class="input input-bordered w-full max-w-xs" />
          <!-- 对话的单元 -->
          <div v-else :class="['csdb-chat-item', { 'csdb-chat-item-active': cid === item.cid }]">
            <!-- 对话标签 -->
            <span class="csdb-chat-label" @click="onSelectChat(item)"> {{ item.cname }} </span>
            <div class="tooltip tooltip-bottom" data-tip="其他操作">
              <div class="csdb-chat-dropdown">
                <button class="btn" @click="showChatOptions($event, item.cid)"><div v-html="options24"></div></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 对话选项放在外侧,不被 chats 的尺寸限制住 -->
      <ul v-show="isShowChatOptions" ref="dropdownRef" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li @click="onEditChatName">
          <a
            ><div v-html="edit24"></div>
            编辑对话名称</a
          >
        </li>
        <li @click="onDeleteChat">
          <a
            ><div v-html="delete24"></div>
            删除对话</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { nextTick, ref, computed, onMounted, onUnmounted } from "vue";
import { edit24, delete24, options24 } from "@/assets/svg";
import { deleteChat, renameChat, getChatSettings } from "@/services";

const store = useStore();
const cid = computed(() => store.state.curChatId);

const chatList = computed(() => {
  return [...store.state.chatList].reverse();
});

const dropdownRef = ref(null);
const isShowChatOptions = ref(false);
const isShowOptionCid = ref("");
const isEditChatName = ref(false);
const editChatName = ref("");

/**
 * 选择对话
 */
const onSelectChat = async (item) => {
  if (item.cid == cid.value) return;
  await store.dispatch("setCurChatId", item.cid);
  await getChatSettings();
};

/**
 * 删除对话
 */
const onDeleteChat = async () => {
  if (isShowOptionCid.value) await deleteChat(isShowOptionCid.value);
  if (isShowOptionCid.value == cid.value) {
    await store.dispatch("setCurChatId", "");
  }
  isShowOptionCid.value = "";
  editChatName.value = "";
  isShowChatOptions.value = false;
};

/**
 * 修改对话名称
 */
const onEditChatName = async () => {
  isEditChatName.value = true;
  editChatName.value = "";
};

/**
 * 修改对话名称
 */
const changeChatName = async () => {
  if (editChatName.value) await renameChat(isShowOptionCid.value, editChatName.value);
  isEditChatName.value = false;
  editChatName.value = "";
};

/**
 * 处理显示点击对话编辑按钮的下拉菜单显示
 */
const showChatOptions = (event, cid) => {
  isShowChatOptions.value = true;
  // 等待 DOM 更新后计算位置
  nextTick(() => {
    const btnRect = event.currentTarget.getBoundingClientRect();

    const dropdownEl = dropdownRef.value;
    if (dropdownEl) {
      dropdownEl.style.position = "absolute";
      // 将 dropdown 放置在按钮下方 由于有header的48像素导致这个减去48最合理
      dropdownEl.style.top = `${btnRect.bottom - 48}px`;
      dropdownEl.style.left = `${btnRect.left}px`;
    }

    isShowOptionCid.value = cid;
  });

  event.stopPropagation();
};

/**
 * 关闭下拉菜单的显示
 */
const handleHiddenDropDownClick = () => {
  isShowChatOptions.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleHiddenDropDownClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleHiddenDropDownClick);
});
</script>

<style lang="scss" scoped>
.chat-sidebar-container {
  height: 100%;
  max-height: 100%;
  background-color: oklch(var(--b1));

  .csdb-chats {
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px;
    overflow-x: hidden;
    width: 232px;
    max-width: 232px;

    .csdb-chats-container {
      background-color: oklch(var(--b1));
      height: 100%;
      width: 100%;
      text-align: center;
      border-right: 1px solid oklch(var(--nc));
      gap: 8px;

      h2 {
        display: flex;
        align-items: center;
        height: 100%;
        flex-direction: column;
        justify-content: center;
      }
    }

    .input {
      height: 36px;
    }

    .csdb-chat-item-input {
      height: 36px;
      width: 206px;
      max-width: 208px;
      border: none;
      border-radius: 10px;
      background-color: transparent;
    }

    .csdb-chat-item {
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
      margin-bottom: 4px;

      &:hover {
        background-color: oklch(var(--b2));
      }
    }

    .csdb-chat-item-active {
      background-color: oklch(var(--b3));
      font-weight: 900;
      font-size: 16px;
    }

    .csdb-chat-label {
      width: 162px;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
    }

    .csdb-chat-dropdown {
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
  }
}
</style>
