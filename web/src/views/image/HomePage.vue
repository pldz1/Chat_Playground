<template>
  <div class="image-homepage-container" ref="dsAlertContainer">
    <!-- 固定的头部 -->
    <div class="ihpc-header">
      <HeaderBar></HeaderBar>
    </div>
    <!-- 主体部分 -->
    <div class="gifp-container">
      <div class="gifp-content">
        <div class="gifp-settings">
          <h4>模型设置</h4>
          <!-- 图像生成的模型 -->
          <div class="gifp-setting-item">
            <span>模型: </span>
            <select class="select select-bordered w-full max-w-xs" v-model="imageModelSettings.model">
              <option v-for="imm in imageModels" :value="imm" :key="imm">{{ imm.name }}</option>
            </select>
          </div>
          <!-- 单词生成数量 -->
          <div class="gifp-setting-item">
            <span>数量: </span>
            <select class="select select-bordered w-full max-w-xs" v-model="imageModelSettings.n">
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="4">4</option>
            </select>
          </div>
          <div>
            <!-- 生成图像的尺寸 -->
            <div class="gifp-setting-item">
              <span class="gifp-setting-label">尺寸: </span>
              <select class="select select-bordered w-full max-w-xs" v-model="imageModelSettings.size">
                <option v-for="imsz in imageModelSize" :key="imsz.value" :value="imsz.value">{{ imsz.name }}</option>
              </select>
            </div>
          </div>
        </div>
        <!-- 显示图像的主题 -->
        <div class="gifp-img-container">
          <div class="gifp-image-card">
            <!-- 占位的加载中图像 -->
            <div class="image-item" v-show="isGenerating">
              <div class="skeleton"></div>
              <div class="image-prompt">{{ imageModelSettings.prompt }}</div>
            </div>
            <!-- 真实的有效的图像内容 -->
            <div v-for="img in imageList" :key="img.id" :class="['image-item', selectedImageId == img.id ? 'global-skeleton-active' : '']">
              <div class="skeleton">
                <img v-if="img.id" :src="img.src" crossOrigin="anonymous" alt="Image" @click="onSelectImage(img.id)" />
              </div>
              <div class="image-prompt">{{ img.prompt }}</div>
            </div>
          </div>
          <!-- 图像的简单操作 -->
          <div class="gifp-image-nav" :class="{ disabled: selectedImageId == null }">
            <div class="join">
              <button class="join-item btn btn-outline" @click="deleteImg">删除图像</button>
              <button class="join-item btn btn-outline" @click="saveTo">保存到本地</button>
              <button class="join-item btn btn-outline" @click="copyToCli">复制到剪切板</button>
            </div>
          </div>
          <!-- 输入图像的提示 -->
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
</template>

<script setup>
import { useStore } from "vuex";
import { computed, nextTick, ref, watch } from "vue";
import { arrowUp32 } from "@/assets/svg";
import { AIGCClient, getImageList, pushImage, deleteImage } from "@/services";
import { imageModelSize, defImageModelSeting } from "@/constants";
import { dsAlert, copyToClipboard, saveToLocal } from "@/utils";
import HeaderBar from "@/components/HeaderBar.vue";

const store = useStore();
const isLoggedIn = computed(() => store.state.isLoggedIn);
const imageModels = computed(() => store.state.models.image);
const imageList = computed(() => store.state.imageList);

const imageModelSettings = ref(structuredClone(defImageModelSeting));
const imageDrawer = new AIGCClient("image");
const isGenerating = ref(false);
const dsAlertContainer = ref(null);
const selectedImageId = ref(null);

/**
 * 选择图片进行保存或者是拷贝到剪切板操作
 */
const onSelectImage = (id) => {
  selectedImageId.value = id;
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
  const { prompt, size, n } = imageModelSettings.value;
  isGenerating.value = true;

  try {
    const urls = await imageDrawer.generateImage(prompt, size, n);
    isGenerating.value = false;
    imageModelSettings.value.prompt = "";

    for (let index = 0; index < urls.length; index++) {
      const item = urls[index];
      if (item.type == "url") {
        await pushImage(prompt, item.data);
      } else {
        imageModelSettings.value.prompt = prompt;
        dsAlert({ type: "error", message: item.data, container: dsAlertContainer.value });
      }
    }
  } catch (err) {
    isGenerating.value = false;
    dsAlert({ type: "error", message: `模型初始化失败: ${String(err)}`, container: dsAlertContainer.value });
  }
};

/**
 * 获取图像元素
 */
const getImgEl = (isItem = false) => {
  const imageItem = document.querySelector(".global-skeleton-active");
  if (!imageItem) return null;
  if (isItem) return imageItem;
  const imgEl = imageItem.firstElementChild.firstElementChild;
  return imgEl;
};

/**
 * 保存图像到剪切板
 */
const copyToCli = async () => {
  const imgEl = getImgEl();
  if (!imgEl) return;
  const flag = await copyToClipboard(imgEl);

  if (flag) dsAlert({ type: "info", message: "图像已成功复制到剪切板", container: dsAlertContainer.value });
  else dsAlert({ type: "error", message: "复制图像到剪切板失败", container: dsAlertContainer.value });
};

/**
 * 删除图像
 */
const deleteImg = async () => {
  await deleteImage(selectedImageId.value);
  selectedImageId.value = null;
  // 用 v-for 发现没有办法及时刷新, 直接强制删除 DIV
  const imageItem = getImgEl(true);
  if (imageItem) imageItem.remove();
};

/**
 * 保存到本地
 */
const saveTo = async () => {
  const imgEl = getImgEl();
  if (!imgEl) return;
  const flag = await saveToLocal(imgEl);

  if (flag) dsAlert({ type: "info", message: "图像已成功保存到本地", container: dsAlertContainer.value });
  else dsAlert({ type: "error", message: "保存失败", container: dsAlertContainer.value });
};

watch(
  () => imageModelSettings.value.model,
  (newVal) => {
    imageDrawer.init(newVal);
  },
  { deep: true, immediate: true },
);

/**
 * 监听登录的状态, 来做页面的初始化
 */
watch(
  () => isLoggedIn.value,
  async (newVal) => {
    if (!newVal) {
      dsAlert({ type: "warn", message: "未登录, 登录获得更好体验🤣." });
      return;
    }

    // 初始化获得一些用户对于对话模型的参数
    await getImageList();
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.image-homepage-container {
  position: relative;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 100%;

  .ihpc-header {
    position: relative;
    height: 48px;
  }

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .gifp-container {
    height: calc(100% - 48px);
    width: calc(100% - 16px);
    padding: 8px;
    background-color: oklch(var(--b1));

    .gifp-content {
      height: 100%;
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
        width: calc(100% - 326px);
        min-width: 406px;
        padding: 16px;

        .gifp-image-card::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }

        .gifp-image-card {
          height: calc(100% - 142px);
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
            box-shadow: oklch(var(--p)) 0px 0px 0px 4px;
          }

          .image-item {
            height: 386px;
            width: 386px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;

            .skeleton {
              height: 324px;
              width: 324px;
              padding: 8px;

              img {
                min-height: 302px;
                min-width: 302px;
                max-height: 302px;
                max-width: 302px;
              }
            }

            .image-prompt {
              height: 72px;
              max-width: 348px;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              user-select: all;
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
          width: 100%;

          .btn {
            width: 126px;
          }
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
            resize: none;
          }
        }
      }
    }
  }
}
</style>
