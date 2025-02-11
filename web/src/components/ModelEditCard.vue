<template>
  <div class="models">
    <div class="collapse collapse-arrow bg-base-200">
      <input type="checkbox" class="peer" />
      <div class="collapse-title text-xl font-medium">
        {{ model.name }}
        <div class="model-edit">
          <div v-html="delete18" @click="deleteModel"></div>
          <div v-if="!isEdit" @click="editModel" v-html="edit18"></div>
          <div v-else @click="editModel" v-html="save18"></div>
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
            <div class="model-item-label">Model API Type:</div>
            <div class="model-item-content">
              <select class="select select-bordered w-full" v-model="model.type">
                <option disabled selected>请选择</option>
                <option>OpenAI</option>
                <option>Azure OpenAI</option>
              </select>
            </div>
          </div>

          <!-- OpenAI 模型的 API 连接 -->
          <div v-if="model.type == 'OpenAI'" class="model-item-row">
            <div class="model-item-label">Base URL:</div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.baseURL" />
              </label>
            </div>
          </div>

          <!-- Azure OpenAI 模型终节点 -->
          <div v-if="model.type == 'Azure OpenAI'" class="model-item-row">
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
                <input type="password" class="grow" placeholder="" v-model="model.apiKey" />
                <button class="btn btn-outline btn-success border-none" @click="copyApiKey">
                  <div v-html="copy16"></div>
                </button>
              </label>
            </div>
          </div>

          <!-- Azure OpenAI 的协议版本 -->
          <div v-if="model.type == 'Azure OpenAI'" class="model-item-row">
            <div class="model-item-label">
              <a class="link link-primary" herf="https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation"> API Version :</a>
            </div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.apiVersion" />
              </label>
            </div>
          </div>

          <!-- Open AI 部署的模型 -->
          <div v-if="model.type == 'OpenAI'" class="model-item-row">
            <div class="model-item-label">Model:</div>
            <div class="model-item-content">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="" v-model="model.model" />
              </label>
            </div>
          </div>

          <!-- Azure OpenAI 的模型 -->
          <div v-if="model.type == 'Azure OpenAI'" class="model-item-row">
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
import { edit18, save18, copy16, delete18 } from "@/assets/svg";

import { dsAlert } from "@/utils";

const emit = defineEmits(["on-update", "on-delete"]);
const props = defineProps({
  model: {
    type: Object,
    default: () => ({ name: "新增模型", type: "", baseURL: "", endpoint: "", apiKey: "", model: "", deployment: "", apiVersion: "" }),
  },
  index: {
    type: Number,
    default: -1,
  },
});

const model = reactive({ ...props.model });
const isEdit = ref(false);

const editModel = async () => {
  isEdit.value = !isEdit.value;

  if (isEdit.value == false) {
    emit("on-update", { index: props.index, model: model });
  }
};

const deleteModel = async () => {
  emit("on-delete", props.index);
};

const copyApiKey = () => {
  navigator.clipboard
    .writeText(model.apiKey)
    .then(() => {
      dsAlert({ type: "success", message: "API Key 已成功复制！" });
    })
    .catch((err) => {
      dsAlert({ type: "error", message: `复制到剪切板失败: ${err}` });
    });
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
