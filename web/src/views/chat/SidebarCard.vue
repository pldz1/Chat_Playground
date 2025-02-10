<template>
  <div class="chat-sidebar-container">
    <!-- 具体下滑内容 -->
    <div class="csdb-chats">
      <!-- chat history list -->
      <div v-for="item in chatNameList" :key="item">
        <input
          v-if="item.chatCid == isEditChatCid"
          v-model="editChatName"
          @keyup.enter="handleEditChatName"
          type="text"
          placeholder="使用Enter键确认..."
          class="input input-bordered w-full max-w-xs"
        />
        <!-- 对话的单元 -->
        <div v-else :class="['csdb-chat-item', { 'csdb-chat-item-active': chatCid === item.chatCid }]">
          <!-- 对话标签 -->
          <span class="csdb-chat-label" @click="onLoadHistory(item)"> {{ item.chatName }} </span>
          <div class="tooltip tooltip-bottom" data-tip="其他操作">
            <div class="csdb-chat-dropdown">
              <button class="btn" @click="showChatOptions"><div v-html="options24"></div></button>
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
            ><div v-html="export24"></div>
            导出对话为文件</a
          >
        </li>
        <li>
          <a
            ><div v-html="delete24"></div>
            删除对话</a
          >
        </li>

        <li>
          <a
            ><div v-html="saveAs24"></div>
            保存为模板</a
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
import { editChatNameByCid, deletChatByCid, downloadChat } from "@/services/chat/common.js";
import { export24, edit24, saveAs24, delete24, options24 } from "@/assets/image/svg-24.js";

const store = useStore();
const chatCid = ref("33");

const chatNameList = ref([
  { chatCid: "1", chatName: "hellowrodl" },
  { chatCid: "2", chatName: "vscode" },
  { chatCid: "3", chatName: "hellowrodl" },
  { chatCid: "4", chatName: "vscode" },
  { chatCid: "5", chatName: "hellowrodl" },
  { chatCid: "6", chatName: "vscode" },
  { chatCid: "7", chatName: "hellowrodl" },
  { chatCid: "8", chatName: "vscode" },
  { chatCid: "9", chatName: "hellowrodl" },
  { chatCid: "11", chatName: "vscode" },
  { chatCid: "12", chatName: "hellowrodl" },
  { chatCid: "13", chatName: "vscode" },
  { chatCid: "21", chatName: "hellowrodl" },
  { chatCid: "22", chatName: "vscode" },
  { chatCid: "31", chatName: "hellowrodl" },
  { chatCid: "23", chatName: "vscode" },
  { chatCid: "24", chatName: "hellowrodl" },
  { chatCid: "32", chatName: "vscode" },
  { chatCid: "33", chatName: "hellowrodl" },
  { chatCid: "43", chatName: "vscode" },
  { chatCid: "44", chatName: "hellowrodl" },
  { chatCid: "41", chatName: "vscode" },
  { chatCid: "45", chatName: "hellowrodl" },
  { chatCid: "51", chatName: "vscode" },
]);

const dropdownRef = ref(null);
const isShowChatOptions = ref(false);
const isEditChatCid = ref("");
const editChatName = ref("");

/** 回调函数触发的对 chat 的操作 */
const onChatOperation = async (id, opt) => {
  if (opt === "Delete") await deletChatByCid(id);
  if (opt === "Download") await downloadChat(id);
  // 点击 Edit 对话后记录要修改名称的对话的 chatCid 并且让它显示成文本编辑框
  if (opt === "Edit") isEditChatCid.value = id;
};

/** onLoadHistory 向父组件发送加载对话的信号，并返回对话的chatCid */
const onLoadHistory = async (item) => {
  if (item.chatCid == chatCid.value) return;
  var flag = await showMessageBox("你想继续这个对话吗?");
  if (!flag) return;
  // 高亮显示当前对话
  store.commit("SET_CHATCID", item.chatCid);
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
