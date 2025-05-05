<template>
  <div class="gusm-any-settings-container">
    <!-- 新版本下载地址 -->
    <div class="gusm-any-settings-row">
      <span>🆕 查看新版本: </span>
      <a class="link link-success" href="https://github.com/pldz1/AIGC_Playground/releases" target="_blank" rel="noopener noreferrer"> GitHub Release </a>
    </div>

    <!-- 有的没有的设置 -->
    <div class="gusm-any-settings-row">
      <span>🎨 默认主题: </span>
      <span>懒得做这个功能了 🥱</span>
    </div>

    <!-- 服务器的地址 -->
    <div class="gusm-any-settings-row">
      <span>⚠️ 服务器地址: </span>
      <input type="text" placeholder="http://127.0.0.1:10088" class="input input-bordered w-full max-w-xs" disabled />
    </div>

    <!-- 登录界面 -->
    <div class="gusm-any-settings-row">
      <button class="btn btn-outline btn-error btn-back-login" @click="onBackLogin">返回登陆界面</button>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const onBackLogin = () => {
  router.push({ path: "/login" });
  store.dispatch("login", null);
};
</script>

<style lang="scss" scoped>
.gusm-any-settings-container {
  gap: 8px;
  display: flex;
  flex-direction: column;

  .gusm-any-settings-row {
    height: 48px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 16px;
    padding: 8px;
    align-items: center;
  }

  .btn-back-login {
    height: 36px;
    min-height: 0px;
  }
}
</style>
