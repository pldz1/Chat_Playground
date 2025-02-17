<template>
  <dialog id="global_image_fun_preview" class="modal">
    <div class="modal-box global-image-fun-preview">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
      </form>
      <h1 class="text-lg font-bold">体验图像功能(⚠️⚠️⚠️图像不会被保存到用户数据库, 及时存到本地 🤧)</h1>
      <div class="gifp-container">
        <div class="gifp-header">
          <span>选择图像模型: </span>
          <select class="select select-bordered w-full max-w-xs" v-model="imageModelSettings.model">
            <option v-for="imm in imageModels" :value="imm" :key="imm">{{ imm.name }}</option>
          </select>
          <span>体验模式: </span>
          <select class="select select-bordered w-full max-w-xs">
            <option>生成(Generate)图像</option>
            <option disabled>编辑(Edit)图像(只针对Dalle2模型)</option>
            <option disabled>变化(Variations)图像(只针对Dalle2模型)</option>
          </select>
        </div>
        <div class="gifp-content">
          <div class="gifp-settings">
            <h4>模型设置</h4>
            <div class="gifp-setting-item">
              <span>数量: </span>
              <select class="select select-bordered w-full max-w-xs" v-model="imageModelSettings.n">
                <option :value="1">1</option>
                <option :value="2">2</option>
                <option :value="4">4</option>
              </select>
            </div>
            <div>
              <div class="gifp-setting-item">
                <span class="gifp-setting-label">尺寸: </span>
                <select class="select select-bordered w-full max-w-xs" v-model="imageModelSettings.size">
                  <option v-for="imsz in imageModelSize" :key="imsz.value" :value="imsz.value">{{ imsz.name }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="gifp-img-container">
            <div class="gifp-image-card">
              <div v-for="(img, index) in images" :key="index" :class="['skeleton', selectedImageIndex == index ? 'global-skeleton-active' : '']">
                <img v-if="img" :src="img" crossOrigin="anonymous" alt="Image" @click="onSelectImage(index)" />
              </div>
              <div v-show="isGenerating" class="skeleton"></div>
            </div>
            <div class="gifp-image-nav" :class="{ disabled: selectedImageIndex == -1 }">
              <div class="join grid grid-cols-2">
                <button class="join-item btn btn-outline" @click="saveTo">保存到本地</button>
                <button class="join-item btn btn-outline" @click="copyToCli">复制到剪切板</button>
              </div>
            </div>
            <div class="gifp-image-input" :class="{ disabled: isGenerating }">
              <textarea class="textarea textarea-bordered" v-model="imageModelSettings.prompt" @keydown.enter="onEnterKeydown"></textarea>
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
import { computed, ref, watch } from "vue";
import { arrowUp32 } from "@/assets/svg";
import { AIGCClient } from "@/services";
import { imageModelSize, imageModelSettings_T } from "@/typings";
import { dsAlert, copyToClipboard, saveToLocal } from "@/utils";

const store = useStore();
const imageModels = computed(() => store.state.models.image);
const images = computed(() => store.state.images);

const imageModelSettings = ref(structuredClone(imageModelSettings_T));
const imageDrawer = new AIGCClient("image");
const isGenerating = ref(false);
const dsAlertContainer = ref(null);
const selectedImageIndex = ref(-1);

watch(
  () => imageModelSettings.value.model,
  (newVal) => {
    imageDrawer.init(newVal);
  },
  { deep: true },
);

/**
 * 选择图片进行保存或者是拷贝到剪切板操作
 */
const onSelectImage = (index) => {
  selectedImageIndex.value = index;
};

/**
 * 输入框的按键组合键
 *  */
const onEnterKeydown = async (event) => {
  // Enter 和 Shift 键表示换行的操作
  if (event.key === "Enter" && !event.shiftKey) {
    // 阻止默认行为（换行）并发送内容
    event.preventDefault();
    await onSendImg();
  }
};

/**
 * 发送生成图片的请求
 */
const onSendImg = async () => {
  if (!dsAlertContainer.value) dsAlertContainer.value = document.getElementById("global_image_fun_preview");

  const { prompt, size, n } = imageModelSettings.value;
  isGenerating.value = true;

  try {
    const urls = await imageDrawer.generateImage(prompt, size, n);
    imageModelSettings.value.prompt = "";
    isGenerating.value = false;
    for (let index = 0; index < urls.length; index++) {
      const item = urls[index];
      if (item.type == "url") await store.dispatch("pushImages", item.data);
      else dsAlert({ type: "error", message: item.data, container: dsAlertContainer.value });
    }
  } catch (err) {
    dsAlert({ type: "error", message: `模型初始化失败: ${String(err)}`, container: dsAlertContainer.value });
    isGenerating.value = false;
    return;
  }
};

/**
 * 获取图像元素
 */
const getImgEl = () => {
  const skeletonEl = document.querySelector(".global-skeleton-active");
  if (!skeletonEl) return null;
  const imgEl = skeletonEl.firstElementChild;
  return imgEl;
};

/**
 * 保存图像到剪切板
 */
const copyToCli = async () => {
  if (!dsAlertContainer.value) dsAlertContainer.value = document.getElementById("global_image_fun_preview");

  const imgEl = getImgEl();
  if (!imgEl) return;
  const flag = await copyToClipboard(imgEl);

  if (flag) dsAlert({ type: "info", message: "图像已成功复制到剪切板", container: dsAlertContainer.value });
  else dsAlert({ type: "error", message: "复制图像到剪切板失败", container: dsAlertContainer.value });
};

/**
 * 保存到本地
 */
const saveTo = async () => {
  if (!dsAlertContainer.value) dsAlertContainer.value = document.getElementById("global_image_fun_preview");

  const imgEl = getImgEl();
  if (!imgEl) return;
  const flag = await saveToLocal(imgEl);

  if (flag) dsAlert({ type: "info", message: "图像已成功保存到本地", container: dsAlertContainer.value });
  else dsAlert({ type: "error", message: "保存失败", container: dsAlertContainer.value });
};
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
          user-select: none;

          .global-skeleton-active {
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
