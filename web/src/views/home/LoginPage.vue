<template>
  <div class="home-login-container">
    <div class="hlcc-container">
      <!-- header -->
      <h1 class="hlcc-title">Welcome back</h1>
      <!-- username & password -->
      <form>
        <div class="hlcc-form-group">
          <input class="hlcc-form-input" autocomplete="username" v-model="username" required />
          <label class="hlcc-form-label">User name*</label>
        </div>
        <div class="hlcc-form-group">
          <input class="hlcc-form-input" autocomplete="new-password" type="password" v-model="password" required />
          <label class="hlcc-form-label">Password*</label>
        </div>
      </form>
      <!-- login button -->
      <button class="btn btn-success hlcc-login-b-w" @click="onLogin">Login</button>

      <div class="hlcc-or"><span>OR</span></div>
      <!-- sign in -->
      <a class="hlcc-a-tips" @click.prevent="onSignIn">Don't have an account? <strong>Click here</strong></a>
      <a class="hlcc-a-tips" @click.prevent="onExperience">Experience it first! 🚀</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login, getModels } from "@/services";
import { dsAlert, dsLoading } from "@/utils";

const router = useRouter();

const username = ref("admin");
const password = ref("admin");

/** 判断用户身份然后登录到应用中，并存入全局的身份信息. */
const onLogin = async () => {
  // 限制操作
  dsLoading(true);
  const flag = await login(username.value, password.value);
  if (flag) {
    router.push({ path: "/home" });
    // 设置初始化的模型
    await getModels();
  }
  dsLoading(false);
};

const onSignIn = () => {
  dsAlert({ type: "info", message: "This is a test function which is waiting for further development! 😄" });
};

const onExperience = () => {
  router.push({ path: "/home" });
};
</script>

<style lang="scss" scoped>
.home-login-container {
  display: flex;
  height: 100vh;
  width: 100vw;

  .hlcc-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto auto;

    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 320px;
    height: 380px;

    .hlcc-title {
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: 700;
    }

    .hlcc-form-group {
      position: relative;
      margin-bottom: 20px;

      .hlcc-form-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .hlcc-form-label {
        position: absolute;
        top: -8px;
        left: 10px;
        background-color: white;
        padding: 0 5px;
        color: #666;
        font-size: 12px;
      }
    }

    .hlcc-login-b-w {
      width: 100%;
      padding: 10px;
    }

    .hlcc-a-tips {
      display: block;
      margin: 10px 0;
      color: #007bff;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .hlcc-or {
      margin: 20px 0;
      position: relative;
      text-align: center;
      &::before,
      &::after {
        content: "";
        width: 40%;
        height: 1px;
        background: #ccc;
        position: absolute;
        top: 50%;
      }
      &::before {
        left: 0;
      }
      &::after {
        right: 0;
      }
      span {
        background: white;
        padding: 0 10px;
        position: relative;
        color: #666;
      }
    }
  }
}
</style>
