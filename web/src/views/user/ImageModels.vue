<template>
  <div class="gusm-any-settings-container">
    <div v-for="(imageModel, index) in models.image">
      <ModelEditCard
        :index="index"
        :model="imageModel"
        :model-type-list="imageModelTypeList"
        @on-update="onUpdateImageModels"
        @on-delete="onDeleteImageModels"
      ></ModelEditCard>
    </div>
    <button class="btn btn-error w-52" @click="addImageModel">
      <div v-html="add24"></div>
      新增图像模型
    </button>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { add24 } from "@/assets/svg";
import { defModelType, imageModelTypeList } from "@/constants";
import { append4Random } from "@/utils";

import ModelEditCard from "@/components/ModelEditCard.vue";

import { setModels } from "@/services";

const store = useStore();
const models = computed(() => store.state.models);

const onUpdateImageModels = async (data) => {
  if (data.index == -1) return;
  else {
    const tmpModels = { ...models.value };
    tmpModels.image[data.index] = data.model;
    await store.dispatch("setModels", tmpModels);
    await setModels();
  }
};

const onDeleteImageModels = async (index) => {
  if (index == -1) return;
  else {
    const tmpModels = { ...models.value };
    tmpModels.image.splice(index, 1);
    await store.dispatch("setModels", tmpModels);
    await setModels();
  }
};

const addImageModel = async () => {
  const tmpModels = { ...models.value };
  const tmpImageModel = structuredClone(defModelType);
  tmpImageModel.name = append4Random("图像模型");
  tmpModels.image.push(tmpImageModel);
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
