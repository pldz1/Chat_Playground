<template>
  <div class="aigc-playground-home">
    <!-- API Markdown 笔记入口卡片 -->
    <div class="hero bg-base-200 aiph-hero-size">
      <div class="hero-content flex-col lg:flex-row">
        <div>
          <h1 class="text-5xl font-bold">📘 API笔记</h1>
          <p class="py-6">用原生的代码 直接调用 OpenAI, Azure OpenAI, DeepSeek 三种API库的笔记.</p>
          <button class="btn btn-primary w-full" @click="onGoChat">让我康康</button>
        </div>
      </div>
    </div>

    <!-- 对话入口卡片 -->
    <div class="hero bg-base-200 aiph-hero-size">
      <div class="hero-content flex-col lg:flex-row">
        <div>
          <h1 class="text-5xl font-bold">💬 开始对话！</h1>
          <p class="py-6">目前支持OpenAI, Azure OpenAI, DeepSeek 三种API库, 对话现在能够调用思考(reasoning)模型的API啦 🥳.</p>
          <button class="btn btn-primary w-full" @click="onGoChat">冲冲冲</button>
        </div>
      </div>
    </div>

    <!-- 图像入口卡片 -->
    <div class="hero bg-base-200 aiph-hero-size">
      <div class="hero-content flex-col lg:flex-row">
        <div>
          <h1 class="text-5xl font-bold">📷 图片生成！</h1>
          <p class="py-6">用Dalle模型, 然后对图像生成, 对话页面也有生图的快速窗口🧐</p>
          <button class="btn btn-primary w-full" @click="onGoImage">简单看看</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const onGoChat = async () => {
  router.push({ path: "/chat" });
};

const onGoImage = async () => {
  router.push({ path: "/image" });
};
</script>
<style lang="scss" scoped>
.aigc-playground-home {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;

  p {
    height: 120px;
  }

  .aiph-hero-size {
    width: 400px;
    height: 300px;
    border-radius: 24px;
  }
}
</style>
