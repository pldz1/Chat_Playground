<template>
  <div class="chat-sidebar-container" id="chat-sidebar-container">
    <!-- header -->
    <div class="header">
      <!-- sidebar -->
      <el-tooltip content="Close sidebar" placement="bottom" :show-after="500">
        <el-button class="button" @click="onShowSidebar">
          <div class="svg-icon" v-html="SVGS.sildbarIcon"></div>
        </el-button>
      </el-tooltip>
      <!-- new chat -->
      <el-tooltip content="New Chat" placement="bottom" :show-after="500">
        <el-button class="button" @click="onNewChat">
          <div class="svg-icon" v-html="SVGS.newChatIcon"></div>
        </el-button>
      </el-tooltip>
    </div>
    <!-- content -->
    <div v-show="isShowSidebar" class="content">
      <div class="chats">
        <!-- chat history list -->
        <div v-for="item in chatNameList" :key="item">
          <el-input
            v-if="item.chatCid == isEditChatCid"
            class="chat-item-input"
            v-model="editChatName"
            placeholder="使用Enter键确认..."
            @keyup.enter="handleEditChatName"
          ></el-input>
          <!-- chat item -->
          <el-button
            v-else
            @click="onLoadHistory(item)"
            :class="[
              'chat-item',
              { 'selected-chat-item': chatCid === item.chatCid },
            ]"
          >
            <!-- chat item label -->
            <el-text
              class="truncated-text"
              :tag="chatCid === item.chatCid ? 'b' : 'span'"
              >{{ item.chatName }}</el-text
            >
            <!-- chat item options -->
            <el-dropdown trigger="click" class="options">
              <div
                class="svg-icon"
                v-html="SVGS.optionsIcon"
                @click.stop="onShowChatOpts"
              ></div>

              <template #dropdown>
                <el-dropdown-menu>
                  <!-- download or share -->
                  <el-dropdown-item
                    @click.stop="downloadSpecChatMsgs(item.chatCid)"
                  >
                    <div class="svg-icon" v-html="SVGS.downloadIcon"></div>
                    <el-text
                      style="margin-left: 8px; font-family: 'Microsoft YaHei'"
                      >Download</el-text
                    >
                  </el-dropdown-item>
                  <!-- rename -->
                  <el-dropdown-item @click.stop="onEditChat(item.chatCid)">
                    <div class="svg-icon" v-html="SVGS.editIcon"></div>
                    <el-text
                      style="margin-left: 8px; font-family: 'Microsoft YaHei'"
                      >Edit</el-text
                    >
                  </el-dropdown-item>
                  <!-- delete -->
                  <el-dropdown-item
                    @click.stop="deletChatByCid(item.chatCid, item.chatName)"
                    style="color: red"
                  >
                    <div class="svg-icon" v-html="SVGS.deleteIcon"></div>
                    <el-text
                      style="
                        color: red;
                        margin-left: 8px;
                        font-family: 'Microsoft YaHei';
                      "
                      >Delete</el-text
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as SVGS from "../../assets/styles/chat/svgs.js";
import * as DOMSIZE from "../../assets/styles/consts.js";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { showMessageBox } from "../../helper/customMessage.js";
import {
  editChatNameByCid,
  deletChatByCid,
  downloadSpecChatMsgs,
} from "../../helper/chat/common.js";

export default {
  // vue3父子传值（setup函数和setup语法糖两版 https://juejin.cn/post/7246596605956194341
  emits: ["onShowSidebar"],
  props: {
    isShowSidebar: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, context) {
    const store = useStore();
    const chatCid = computed(() => store.state.chat.chatCid);
    const chatNameList = computed(() => store.state.chat.chatNameList);

    const isEditChatCid = ref("");
    const editChatName = ref("");

    /** onShowSidebar 向父组件发送显示或者隐藏侧边栏的信号, 返回是否开关侧边栏的布尔量 */
    const onShowSidebar = () => {
      var val = props.isShowSidebar ? false : true;
      var sidebarDOM = document.getElementById("chat-sidebar-container");
      if (!val) {
        sidebarDOM.style.width = `${DOMSIZE.SIDEBAR_MIN_WIDTH}px`;
        sidebarDOM.style.backgroundColor = "transparent";
      } else {
        sidebarDOM.style.width = "";
        sidebarDOM.style.backgroundColor = DOMSIZE.SIDEBAR_BACKGROUND_COLOR;
      }
      // 通知父组件修改值
      context.emit("onShowSidebar", val);
    };

    /** onNewChat 向父组件发送要新建对话的信号 */
    const onNewChat = () => {
      store.commit("SET_CHATCID", "");
    };

    /** onLoadHistory 向父组件发送加载对话的信号，并返回对话的chatCid */
    const onLoadHistory = async (item) => {
      if (item.chatCid == chatCid.value) return;
      var flag = await showMessageBox("你想继续这个Chat进行对话吗?");
      if (!flag) return;
      // 高亮显示当前对话
      store.commit("SET_CHATCID", item.chatCid);
    };

    /** onEditChat 点击edit对话后记录要修改名称的对话的 chatCid 并且让它显示成文本编辑框 */
    const onEditChat = (chatCid) => {
      isEditChatCid.value = chatCid;
    };

    /** handleEditChatName 用键盘的enter表示确认修改对话名称 */
    const handleEditChatName = async () => {
      await editChatNameByCid(isEditChatCid.value, editChatName.value);
      isEditChatCid.value = "";
      editChatName.value = "";
    };

    return {
      SVGS,
      chatCid,
      chatNameList,
      isEditChatCid,
      editChatName,
      onShowSidebar,
      onNewChat,
      onLoadHistory,
      deletChatByCid,
      downloadSpecChatMsgs,
      onEditChat,
      handleEditChatName,
    };
  },
};
</script>
