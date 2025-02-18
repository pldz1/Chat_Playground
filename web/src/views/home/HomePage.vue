<template>
  <div class="aigc-playground-home">
    <div class="hero bg-base-200 aiph-hero-size">
      <div class="hero-content flex-col lg:flex-row">
        <div>
          <h1 class="text-5xl font-bold">💬 开始对话！</h1>
          <p class="py-6">目前支持OpenAI, Azure OpenAI, DeepSeek 三种API库, 对话现在能够调用思考(reasoning)模型的API啦 🥳.</p>
          <button class="btn btn-primary w-full" @click="onGoChat">冲冲冲</button>
        </div>
      </div>
    </div>

    <div class="hero bg-base-200 aiph-hero-size">
      <div class="hero-content flex-col lg:flex-row">
        <div>
          <h1 class="text-5xl font-bold">📷 图片生成！</h1>
          <p class="py-6">用Dalle模型, 然后对图像生成/编辑/变化, 还在做 🥱, 对话页面有生图的体验... ...</p>
          <button class="btn btn-primary w-full">不冲了, 不冲了, 冲不动了 😪</button>
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
