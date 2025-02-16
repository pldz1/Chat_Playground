<template>
  <div class="gusm-any-settings-container">
    <div v-for="(rtaudioModel, index) in models.rtaudio">
      <ModelEditCard
        :index="index"
        :model="rtaudioModel"
        :model-type-list="rtaudioModelTypeList"
        @on-update="onUpdateRtaudioModels"
        @on-delete="onDeleteRtaudioModels"
      ></ModelEditCard>
    </div>
    <button class="btn btn-error w-52" @click="addRtaudioModel">
      <div v-html="add24"></div>
      新增实时语音模型
    </button>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { add24 } from "@/assets/svg";
import { model_T, rtaudioModelTypeList } from "@/typings";
import { append4Random } from "@/utils";

import ModelEditCard from "@/components/ModelEditCard.vue";

import { setModels } from "@/services";

const store = useStore();
const models = computed(() => store.state.models);

const onUpdateRtaudioModels = async (data) => {
  if (data.index == -1) return;
  else {
    const tmpModels = { ...models.value };
    tmpModels.rtaudio[data.index] = data.model;
    await store.dispatch("setModels", tmpModels);
    await setModels();
  }
};

const onDeleteRtaudioModels = async (index) => {
  if (index == -1) return;
  else {
    const tmpModels = { ...models.value };
    tmpModels.rtaudio.splice(index, 1);
    await store.dispatch("setModels", tmpModels);
    await setModels();
  }
};

const addRtaudioModel = async () => {
  const tmpModels = { ...models.value };
  const tmpRtaudioModel = structuredClone(model_T);
  tmpRtaudioModel.name = append4Random("语音模型");
  tmpModels.rtaudio.push(tmpRtaudioModel);
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
