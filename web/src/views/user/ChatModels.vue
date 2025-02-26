<template>
  <div class="gusm-any-settings-container">
    <div v-for="(chatModel, index) in models.chat">
      <ModelEditCard
        :index="index"
        :model="chatModel"
        :model-type-list="chatModelTypeList"
        @on-update="onUpdateChatModels"
        @on-delete="onDeleteChatModels"
      ></ModelEditCard>
    </div>
    <button class="btn btn-error w-52" @click="addChatModel">
      <div v-html="add24"></div>
      新增对话模型
    </button>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { add24 } from "@/assets/svg";
import { defModelType, chatModelTypeList } from "@/constants";
import { append4Random } from "@/utils";

import ModelEditCard from "@/components/ModelEditCard.vue";

import { setModels } from "@/services";

const store = useStore();
const models = computed(() => store.state.models);

const onUpdateChatModels = async (data) => {
  if (data.index == -1) return;
  else {
    const tmpModels = { ...models.value };
    tmpModels.chat[data.index] = data.model;
    await store.dispatch("setModels", tmpModels);
    await setModels();
  }
};

const onDeleteChatModels = async (index) => {
  if (index == -1) return;
  else {
    const tmpModels = { ...models.value };
    tmpModels.chat.splice(index, 1);
    await store.dispatch("setModels", tmpModels);
    await setModels();
  }
};

const addChatModel = async () => {
  const tmpModels = { ...models.value };
  const tmpChatModel = structuredClone(defModelType);
  tmpChatModel.name = append4Random("对话模型");
  tmpModels.chat.push(tmpChatModel);
  await store.dispatch("setModels", tmpModels);
  await setModels();
};
</script>

<style lang="scss" scoped>
.gusm-any-settings-container {
  gap: 8px;
  display: flex;
  flex-direction: column;
}
</style>
