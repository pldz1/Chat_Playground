<template>
  <div class="models">
    <div class="collapse collapse-arrow bg-base-200">
      <input type="checkbox" class="peer" ref="modelEditCheckbox" />
      <div class="collapse-title text-xl font-medium">
        <span class="model-name">{{ model.name }}</span>
        <div class="model-edit">
          <div v-html="delete18" class="tooltip tooltip-left" data-tip="删除模型" @click="deleteModel"></div>
          <div v-if="!isEdit" @click="editModel" class="tooltip tooltip-left" data-tip="编辑模型(记得再次点击保存)" v-html="edit18"></div>
          <div v-else @click="editModel" v-html="save18" class="tooltip tooltip-left" data-tip="保存修改"></div>
        </div>
      </div>

      <div class="collapse-content">
        <div :class="['model-details', { 'edit-disabled': !isEdit }]">
          <!-- 模型的名字 -->
          <div class="model-item-row">
            <div class="model-item-label">Name:</div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.name" />
              </label>
            </div>
          </div>
          <!-- 模型 API 接口类型 -->
          <div class="model-item-row">
            <div class="model-item-label">API Type:</div>
            <div class="model-item-content">
              <select class="select select-bordered w-full" v-model="model.apiType">
                <option v-for="ai in apiTypeList" :value="ai.value">{{ ai.name }}</option>
              </select>
            </div>
          </div>

          <!-- OpenAI 模型的 API 连接 -->
          <div v-if="model.apiType == 'OpenAI' || model.apiType == 'DeepSeek'" class="model-item-row">
            <div class="model-item-label">Base URL:</div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.baseURL" />
              </label>
            </div>
          </div>

          <!-- Azure OpenAI 模型终节点 -->
          <div v-if="model.apiType == 'Azure OpenAI'" class="model-item-row">
            <div class="model-item-label">End Point:</div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.endpoint" />
              </label>
            </div>
          </div>

          <!-- 模型 API key -->
          <div class="model-item-row">
            <div class="model-item-label">API key:</div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.apiKey" />
              </label>
            </div>
          </div>

          <!-- Azure OpenAI 的协议版本 -->
          <div v-if="model.apiType == 'Azure OpenAI'" class="model-item-row">
            <div class="model-item-label">
              <a
                class="link link-primary"
                href="https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Version :
              </a>
            </div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.apiVersion" />
              </label>
            </div>
          </div>

          <!-- 模型 API 接口类型 -->
          <div class="model-item-row">
            <div class="model-item-label">Model Type:</div>
            <div class="model-item-content">
              <select class="select select-bordered w-full" v-model="model.modelType">
                <option v-for="mi in props.modelTypeList" :value="mi.value">{{ mi.name }}</option>
              </select>
            </div>
          </div>

          <!-- Open AI 部署的模型 -->
          <div v-if="model.apiType == 'OpenAI' || model.apiType == 'DeepSeek'" class="model-item-row">
            <div class="model-item-label">Model:</div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.model" />
              </label>
            </div>
          </div>

          <!-- Azure OpenAI 的模型 -->
          <div v-if="model.apiType == 'Azure OpenAI'" class="model-item-row">
            <div class="model-item-label">Deployment:</div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.deployment" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { edit18, save18, delete18 } from "@/assets/svg";
import { model_T, apiTypeList } from "@/typings";

const emit = defineEmits(["on-update", "on-delete"]);
const props = defineProps({
  model: {
    type: Object,
    default: () => structuredClone(model_T),
  },
  modelTypeList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  index: {
    type: Number,
    default: -1,
  },
});

const model = reactive({ ...props.model });
const isEdit = ref(false);
const modelEditCheckbox = ref(null);

const editModel = async () => {
  isEdit.value = !isEdit.value;

  if (isEdit.value && modelEditCheckbox.value) modelEditCheckbox.value.checked = true;

  if (isEdit.value == false) {
    emit("on-update", { index: props.index, model: model });
  }
};

const deleteModel = async () => {
  emit("on-delete", props.index);
};

watch(
  () => props.model,
  (newModel) => {
    Object.assign(model, newModel);
  },
  { deep: true, immediate: true },
);
</script>

<style lang="scss" scoped>
.models {
  .collapse-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .peer {
    z-index: 1;
  }

  .model-name {
    min-width: 100px;
  }
  .model-edit {
    z-index: 2;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  .model-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
  }
  .model-item-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 24px;
    height: 48px;

    .model-item-label {
      width: 136px;
      font-size: 12px;
      text-align: right;
    }

    .model-item-content {
      width: 448px;
    }
  }

  .edit-disabled {
    .model-item-row {
      pointer-events: none;
      opacity: 0.5;
    }
  }
}
</style>
