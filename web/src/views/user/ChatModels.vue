<template>
  <div class="gusm-chat-models">
    <div v-for="(chatModel, index) in chatModels">
      <ModelEditCard :index="index" :model="chatModel" @on-update="onUpdateChatModels" @on-delete="onDeleteChatModels"></ModelEditCard>
    </div>
    <button class="btn btn-error w-52" @click="addChatModel">
      <div v-html="add24"></div>
      新增模型
    </button>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import ModelEditCard from "@/components/ModelEditCard.vue";
import { add24 } from "@/assets/svg";
import { chatModel_T } from "@/typings";
import { append4Random } from "@/utils";

import { setChatModels } from "@/services";

const store = useStore();
const chatModels = computed(() => store.state.chatModels);

const onUpdateChatModels = async (data) => {
  if (data.index == -1) return;
  else {
    const tmpChatModels = [...chatModels.value];
    tmpChatModels[data.index] = data.model;
    await setChatModels(tmpChatModels);
  }
};

const onDeleteChatModels = async (index) => {
  if (index == -1) return;
  else {
    const tmpChatModels = [...chatModels.value];
    tmpChatModels.splice(index, 1);
    await setChatModels(tmpChatModels);
  }
};

const addChatModel = async () => {
  const tmpChatModels = [...chatModels.value];
  const tmpChatModel = structuredClone(chatModel_T);
  tmpChatModel.name = append4Random("对话模型");
  tmpChatModels.push(tmpChatModel);
  await setChatModels(tmpChatModels);
};
</script>

<style lang="scss" scoped>
.gusm-chat-models {
  gap: 8px;
  display: flex;
  flex-direction: column;
}
</style>
