<template>
  <div class="chat-sidebar-container">
    <!-- 具体下滑内容 -->
    <div class="csdb-chats">
      <div v-if="chatList.length == 0" class="csdb-chats-container">
        <h2 class="font-bold">
          无对话列表
          <br />
          <img
            loading="lazy"
            width="72"
            height="72"
            alt="yawing face emoji"
            src="https://img.daisyui.com/images/emoji/yawning-face@80.webp"
            srcset="https://img.daisyui.com/images/emoji/yawning-face.webp 2x"
            class="pointer-events-none inline-block h-[5em] w-[5em] align-bottom"
          />
        </h2>
      </div>
      <!-- chat history list -->
      <div v-else class="csdb-chats-container">
        <div v-for="item in chatList" :key="item">
          <input
            v-if="item.cid == isEditChatCid"
            v-model="editChatName"
            @keyup.enter="handleEditChatName"
            type="text"
            placeholder="使用Enter键确认..."
            class="input input-bordered w-full max-w-xs"
          />
          <!-- 对话的单元 -->
          <div v-else :class="['csdb-chat-item', { 'csdb-chat-item-active': cid === item.cid }]">
            <!-- 对话标签 -->
            <span class="csdb-chat-label" @click="onLoadHistory(item)"> {{ item.cname }} </span>
            <div class="tooltip tooltip-bottom" data-tip="其他操作">
              <div class="csdb-chat-dropdown">
                <button class="btn" @click="showChatOptions"><div v-html="options24"></div></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 对话选项放在外侧,不被 chats 的尺寸限制住 -->
      <ul v-if="isShowChatOptions" ref="dropdownRef" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li>
          <a
            ><div v-html="edit24"></div>
            编辑对话名称</a
          >
        </li>
        <li>
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
import { nextTick, ref, onMounted, onUnmounted } from "vue";
import { showMessageBox } from "@/utils/custom-message.js";
import { edit24, delete24, options24 } from "@/assets/svg";

const store = useStore();
const cid = ref("33");

const chatList = ref([]);

const dropdownRef = ref(null);
const isShowChatOptions = ref(false);
const isEditChatCid = ref("");
const editChatName = ref("");

/** 回调函数触发的对 chat 的操作 */
const onChatOperation = async (id, opt) => {
  if (opt === "Delete") await deletChatByCid(id);
  if (opt === "Download") await downloadChat(id);
  // 点击 Edit 对话后记录要修改名称的对话的 cid 并且让它显示成文本编辑框
  if (opt === "Edit") isEditChatCid.value = id;
};

/** onLoadHistory 向父组件发送加载对话的信号，并返回对话的chatCid */
const onLoadHistory = async (item) => {
  if (item.cid == cid.value) return;
  var flag = await showMessageBox("你想继续这个对话吗?");
  if (!flag) return;
  // 高亮显示当前对话
  store.commit("SET_CHATCID", item.cid);
};

/** handleEditChatName 用键盘的enter表示确认修改对话名称 */
const handleEditChatName = async () => {
  await editChatNameByCid(isEditChatCid.value, editChatName.value);
  isEditChatCid.value = "";
  editChatName.value = "";
};

/**
 * 处理显示点击对话编辑按钮的下拉菜单显示
 */
const showChatOptions = (event) => {
  event.stopPropagation();
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
  });
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
    gap: 4px;
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

      &:hover {
        background-color: oklch(var(--b2));
      }
    }

    .csdb-chat-item-active {
      background-color: oklch(var(--b3));
      font-weight: 900;
    }

    .csdb-chat-label {
      width: 136px;
      text-align: left;
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

<style lang="scss" scoped>
#global-chat-options {
  position: absolute;
}
</style>
