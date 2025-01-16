<template>
  <!-- overlay-dialog -->
  <el-drawer
    class="chat-settings-drawer"
    v-model="isOpenSettingDialog"
    :before-close="onCancleSettings"
  >
    <!-- header -->
    <template #header>
      <div class="header">
        <el-text class="label">Edit Current Chat Settings</el-text>
      </div>
    </template>

    <!-- settings tab -->
    <div class="content">
      <el-divider class="divider" />

      <el-scrollbar class="scroll-bar">
        <!-- chat name and model type -->
        <div class="title">
          <el-text class="label">Edit chat name and model type.</el-text>
        </div>
        <div class="item">
          <el-text class="item-text">Chat name: </el-text>
          <el-input class="input" v-model="chatParams.chatName" />
        </div>
        <div class="item">
          <el-text class="item-text">Select model: </el-text>
          <el-select v-model="chatParams.modelName" class="item-select">
            <el-option
              v-for="item in chatModelList"
              :key="item.modelName"
              :label="item.modelName"
              :value="item.modelName"
              @click="onSelectModel(chatParams, item)"
            />
          </el-select>
        </div>
        <div class="item">
          <el-text class="item-text">Use default settings: </el-text>
          <el-switch class="c-switch" v-model="isUseDefault" :disabled="true" />
        </div>
        <el-divider class="divider" />
        <!-- chat prompts -->
        <div class="title">
          <el-text class="label">Edit chat prompts</el-text>
        </div>
        <div class="item-textarea">
          <el-text class="item-text">System: </el-text>
          <el-input
            class="input"
            type="textarea"
            v-model="chatSysPrompt"
            @input="updateChatPrompts"
          />
        </div>
        <div class="item-textarea">
          <el-text class="item-text">User: </el-text>
          <el-input
            class="input"
            type="textarea"
            v-model="chatUserPrompt"
            @input="updateChatPrompts"
          />
        </div>
        <div class="item-textarea">
          <el-text class="item-text">Assist: </el-text>
          <el-input
            class="input"
            type="textarea"
            v-model="chatAssPrompt"
            @input="updateChatPrompts"
          />
        </div>
        <el-divider class="divider" />
        <!-- chat parameters -->
        <div class="title">
          <el-text class="label">Edit chat parameters.</el-text>
        </div>
        <div class="item">
          <el-text class="item-text">Passed Message(1~20): </el-text>
          <el-slider
            class="slider"
            v-model="chatParams.passedMsgLen"
            :min="1"
            :max="20"
          />
          <el-input
            v-model.number="chatParams.passedMsgLen"
            class="input-slider"
            @input="validateRange('passedMsgLen', 1, 20)"
          />
        </div>
        <div class="item">
          <el-text class="item-text">Max Response(1~8192): </el-text>
          <el-slider
            class="slider"
            v-model="chatParams.maxResponseTokens"
            :min="1"
            :max="8192"
          />
          <el-input
            v-model.number="chatParams.maxResponseTokens"
            class="input-slider"
            @input="validateRange('maxResponseTokens', 1, 8192)"
          />
        </div>
        <div class="item">
          <el-text class="item-text">Temperature(0.1~1): </el-text>
          <el-slider
            class="slider"
            v-model="chatParams.temperature"
            :min="0.01"
            :max="1"
            :step="0.01"
          />
          <el-input
            v-model.number="chatParams.temperature"
            class="input-slider"
            @input="validateRange('temperature', 0.1, 1)"
          />
        </div>
        <div class="item">
          <el-text class="item-text">Top P(0.1~1): </el-text>
          <el-slider
            class="slider"
            v-model="chatParams.topP"
            :min="0.01"
            :max="1"
            :step="0.01"
          />
          <el-input
            v-model.number="chatParams.topP"
            class="input-slider"
            @input="validateRange('topP', 0.1, 1)"
          />
        </div>
        <div class="item">
          <el-text class="item-text">Frequecy penalty(0~2): </el-text>
          <el-slider
            class="slider"
            v-model="chatParams.frequecyPenaty"
            :min="0"
            :max="2"
            :step="0.01"
          />
          <el-input
            v-model.number="chatParams.frequecyPenaty"
            class="input-slider"
            @input="validateRange('frequecyPenaty', 0, 2)"
          />
        </div>
        <div class="item">
          <el-text class="item-text">Presence penalty(0~2): </el-text>
          <el-slider
            class="slider"
            v-model="chatParams.presentPenaty"
            :min="0"
            :max="2"
            :step="0.01"
          />
          <el-input
            v-model.number="chatParams.presentPenaty"
            class="input-slider"
            @input="validateRange('presentPenaty', 0, 2)"
          />
        </div>
        <div class="item-textarea">
          <el-text class="item-text">Stop sequences: </el-text>
          <el-input
            class="input"
            type="textarea"
            v-model="chatStopSequence"
            @input="validStopSequence(chatParams, chatStopSequence)"
          />
        </div>
      </el-scrollbar>
      <el-divider class="divider" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="cancel" @click="onCancleSettings">Cancel</el-button>
        <el-button class="confirm" @click="onStartChat"> Confirm </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { showMessage } from "@/utils/custom-message.js";
import {
  onSelectModel,
  getPromptByRole,
  handleChatPrompts,
  validStopSequence,
  handleSetChatParams,
} from "@/services/chat/settings.js";

// 从store中得到关于chat的状态
const store = useStore();
const chatModelList = computed(() => store.state.chat.modelList);

// 控制对话框的属性
const isOpenSettingDialog = ref(false);

// 要被修改的对话的全部参数
const chatParams = ref({});
const chatSysPrompt = ref("");
const chatUserPrompt = ref("");
const chatAssPrompt = ref("");
const chatStopSequence = ref("");
const isUseDefault = ref(true);

// 绕过v-model提示的computed是readonly的行为
watch(
  () => store.state.chat.isEditChatSettings,
  async (value) => {
    isOpenSettingDialog.value = value;
    if (value) {
      Object.keys(store.state.chat.chatParams).forEach((key) => {
        chatParams.value[key] = store.state.chat.chatParams[key];
      });

      // 幽灵对话隐藏设置
      if (chatParams.value.isGhost) {
        isOpenSettingDialog.value = false;
        showMessage("info", `幽灵对话不支持修改设置 ❌`);
        await onCancleSettings();
        return;
      }

      // 更新对应的 chat prompt的值
      chatSysPrompt.value = getPromptByRole(chatParams.value, "system");
      chatUserPrompt.value = getPromptByRole(chatParams.value, "user");
      chatAssPrompt.value = getPromptByRole(chatParams.value, "assistant");
      chatStopSequence.value = chatParams.value.stopSequence.join(";");
    }
  }
);

/** validateRange 限制参数的范围 这个内容可以不用抽出去 */
const validateRange = (param, min, max) => {
  chatParams.value[param] = Math.max(
    min,
    Math.min(max, chatParams.value[param])
  );
};

/** updateChatPrompts 动态更新提示词的内容 */
const updateChatPrompts = () => {
  handleChatPrompts(
    chatParams.value,
    chatSysPrompt.value,
    chatUserPrompt.value,
    chatAssPrompt.value
  );
};

/** onCancleSettings关闭当前的setting窗口 */
const onCancleSettings = async () => {
  store.commit("SET_CHAT_SHOWSETTINGUI", false);
};

/** onStartChat 向server发送请求创建对应的对话的channel */
const onStartChat = async () => {
  if (chatParams.value.chatName == "") {
    showMessage("error", "😡 Chat 的名称不能为空!");
    return;
  }
  await handleSetChatParams(chatParams.value);
  onCancleSettings();
};
</script>
