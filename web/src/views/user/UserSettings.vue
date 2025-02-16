<template>
  <dialog id="global_user_settings" class="modal global-user-settings-modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <!-- 标题 -->
      <h3 class="text-lg font-bold">用户设置</h3>
      <!-- 主体内容 -->
      <div class="gusm-content">
        <div class="gusm-menu-container">
          <ul class="menu bg-base-200 rounded-box w-56">
            <li @click="setTabIndex(0)">
              <a
                ><div v-html="instruction16"></div>
                对话指令模板</a
              >
            </li>
            <li @click="setTabIndex(1)">
              <a
                ><div v-html="chat16"></div>
                对话模型</a
              >
            </li>
            <li @click="setTabIndex(2)">
              <a>
                <div v-html="setting16"></div>
                软件设置
              </a>
            </li>
          </ul>
        </div>
        <div class="gusm-panel-container">
          <!-- 对话模型的设置界面 -->
          <div v-if="tab == 1" class="gusm-chat-models">
            <ChatModels></ChatModels>
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
import { instruction16, chat16, setting16 } from "@/assets/svg";

import ChatModels from "./ChatModels.vue";

const tab = ref(0);

const setTabIndex = (value) => {
  tab.value = value;
};
</script>

<style lang="scss" scoped>
.global-user-settings-modal {
  .modal-box {
    max-width: 1024px;
    max-height: 668px;
    overflow: hidden;
  }

  .gusm-content {
    display: flex;
    margin-top: 16px;
    min-height: 300px;
    max-height: 516px;
    max-width: 976px;
    flex-direction: row;
    overflow-y: auto;

    .gusm-menu-container {
      width: 224px;
    }

    .gusm-panel-container {
      display: flex;
      width: 748px;
      padding: 8px;
      flex-direction: column;
      overflow-y: auto;
    }
  }
}
</style>
