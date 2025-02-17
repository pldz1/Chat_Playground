<template>
  <dialog id="global_image_fun_preview" class="modal">
    <div class="modal-box global-image-fun-preview">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
      </form>
      <h3 class="text-lg font-bold">体验图像功能</h3>
      <div class="gifp-container">
        <div class="gifp-header">
          <span>选择图像模型: </span>
          <select class="select select-bordered w-full max-w-xs" v-model="settings.model">
            <option v-for="imm in imageModels" :value="imm" :key="imm">{{ imm.name }}</option>
          </select>
          <span>体验模式: </span>
          <select class="select select-bordered w-full max-w-xs">
            <option>生成(Generate)图像</option>
            <option>编辑(Edit)图像(只针对Dalle2模型)</option>
            <option>变化(Variations)图像(只针对Dalle2模型)</option>
          </select>
        </div>
        <div class="gifp-content">
          <div class="gifp-settings">
            <h4>模型设置</h4>
            <div class="gifp-setting-item">
              <span>数量: </span>
              <select class="select select-bordered w-full max-w-xs">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
              </select>
            </div>
            <div>
              <div class="gifp-setting-item">
                <span class="gifp-setting-label">尺寸: </span>
                <select class="select select-bordered w-full max-w-xs" v-model="settings.size">
                  <option v-for="imsz in imageModelSize" :key="imsz.value" :value="imsz.value">{{ imsz.name }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="gifp-img-container">
            <div class="gifp-image-card">
              <div v-for="(img, index) in images" :key="index" :class="['skeleton', curImageIndex === index ? 'active' : '']">
                <img v-if="img" :src="img" alt="Image" />
              </div>

              <div class="skeleton"></div>
            </div>
            <div class="gifp-image-nav">
              <div class="join grid grid-cols-4">
                <button class="join-item btn btn-outline disabled">上传照片</button>
                <button class="join-item btn btn-outline disabled">保存到本地</button>
                <button class="join-item btn btn-outline disabled">保存到剪切板</button>
                <button class="join-item btn btn-outline disabled">删除</button>
              </div>
              <select class="select select-bordered w-52" v-model.number="settings.n">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
              </select>
            </div>
            <div class="gifp-image-input">
              <textarea class="textarea textarea-bordered" v-model="settings.prompt"></textarea>
              <button class="btn btn-circle btn-outline" @click="onSendImg">
                <div v-html="arrowUp32"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { arrowUp32 } from "@/assets/svg";
import { AzureOpenAIClient } from "@/services";
import { imageModelSize, imageModelSettings_T } from "@/typings";

const store = useStore();
const imageModels = computed(() => store.state.models.image);
const images = computed(() => store.state.images);

const settings = ref(structuredClone(imageModelSettings_T));
const imageDrawer = new AzureOpenAIClient("", "", "", "");

const onSendImg = async () => {
  const { model, prompt, size, n } = settings.value;
  imageDrawer.update(model.endpoint, model.apiKey, model.deployment, model.apiVersion);
  settings.value.prompt = "";

  const urls = await imageDrawer.generateImage(prompt, size, n);

  for (let index = 0; index < urls.length; index++) {
    const item = urls[index];
    if (item.type == "url") await store.dispatch("pushImages", item.data);
    else alert(item.data);
  }
};

const curImageIndex = ref(-1);
</script>

<style lang="scss" scoped>
.global-image-fun-preview {
  width: 1366px;
  min-width: 1366px;
  height: 668px;
  min-height: 668px;

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .gifp-container {
    height: 574px;
    width: 100%;
    padding: 8px;
    background-color: oklch(var(--b1));

    .gifp-header {
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
    }

    .gifp-content {
      height: 512px;
      width: 100%;
      display: flex;
      flex-direction: row;

      .gifp-settings {
        width: 282px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 8px;
        border-radius: 16px;
        background-color: oklch(var(--b2));

        h4 {
          font-weight: 600;
        }
        .gifp-setting-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          height: 48px;
          gap: 16px;

          span {
            width: 50px;
          }
        }
      }

      .gifp-img-container {
        height: 100%;
        width: 998px;
        padding: 16px;

        .gifp-image-card::-webkit-scrollbar {
          height: 8px;
        }
        .gifp-image-card {
          height: 336px;
          width: 100%;
          max-width: 100%;
          padding: 8px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          overflow-x: auto;

          .active {
            border: 4px solid oklch(var(--p));
          }

          .skeleton {
            min-height: 272px;
            min-width: 272px;
            padding: 8px;

            img {
              min-height: 256px;
              min-width: 256px;
              max-height: 256px;
              max-width: 256px;
            }
          }
        }

        .gifp-image-nav {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          height: 64px;
          padding: 8px;
          gap: 16px;
        }

        .gifp-image-input {
          display: flex;
          flex-direction: row;
          height: 92px;
          align-items: center;
          justify-content: center;
          padding: 8px;
          gap: 16px;

          textarea {
            height: 76px !important;
            width: 800px;
          }
        }
      }
    }
  }
}
</style>
