<template>
  <dialog id="global_user_setting" class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <!-- 标题 -->
      <h3 class="text-lg font-bold">用户设置</h3>
      <!-- 主体内容 -->
      <div class="content">
        <div class="menu-container">
          <ul class="menu bg-base-200 rounded-box w-56">
            <li @click="setTabIndex(0)">
              <a
                ><div v-html="chat16Icon"></div>
                对话模型</a
              >
            </li>
            <li @click="setTabIndex(1)">
              <a>
                <div v-html="setting16Icon"></div>
                软件设置
              </a>
            </li>
          </ul>
        </div>
        <div class="panel-container">
          <!-- 对话模型的设置界面 -->
          <div v-if="tab == 0" class="chat-models">
            <div v-for="(chatModel, index) in chatModels">
              <ModelEditCard :index="index" :model="chatModel" @on-update="onUpdateChatModels" @on-delete="onDeleteChatModels"></ModelEditCard>
            </div>
            <button class="btn btn-error w-52" @click="addChatModel">
              <div v-html="add24Icon"></div>
              新增模型
            </button>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button, it will close the modal -->
          <button class="btn">关闭</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { chat16Icon, setting16Icon, add24Icon } from "@/assets/image/user-setting-svgs.js";
import { setChatModelsAPI } from "@/apis/user-api.js";

import ModelEditCard from "@/components/ModelEditCard.vue";

const store = useStore();
const tab = ref(0);

const chatModels = computed(() => store.state.user.chatModels);
const username = computed(() => store.state.user.username);

const setTabIndex = (value) => {
  tab.value = value;
};

const onUpdateChatModels = async (data) => {
  if (data.index == -1) return;
  else {
    const tmpChatModels = [...chatModels.value];
    tmpChatModels[data.index] = data.model;
    store.dispatch("setChatModels", tmpChatModels);
    await setChatModelsAPI(username.value, JSON.stringify(tmpChatModels));
  }
};

const onDeleteChatModels = async (index) => {
  if (index == -1) return;
  else {
    const tmpChatModels = [...chatModels.value];
    tmpChatModels.splice(index, 1);
    store.dispatch("setChatModels", tmpChatModels);
    await setChatModelsAPI(username.value, JSON.stringify(tmpChatModels));
  }
};

const addChatModel = async () => {
  const tmpChatModels = [...chatModels.value];
  tmpChatModels.push({ name: "新增模型", type: "", endPoint: "", apiKey: "", deployment: "" });
  store.dispatch("setChatModels", tmpChatModels);
  await setChatModelsAPI(username.value, JSON.stringify(tmpChatModels));
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  margin-top: 16px;
  min-height: 300px;
  flex-direction: row;

  .menu-container {
    width: 224px;
  }

  .panel-container {
    display: flex;
    width: 748px;
    padding: 8px;
    flex-direction: column;

    .chat-models {
      gap: 8px;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
