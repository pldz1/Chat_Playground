<template>
  <div class="home-login-container">
    <div class="container">
      <!-- header -->
      <h1 class="title">Welcome back</h1>
      <!-- userName & password -->
      <div class="form-group">
        <input class="form-input" v-model="userName" required />
        <label class="form-label">User name*</label>
      </div>
      <div class="form-group">
        <input class="form-input" type="password" v-model="password" required />
        <label class="form-label">Password*</label>
      </div>
      <!-- login button -->
      <button class="btn btn-success login-b-w" @click="onLogin">Login</button>

      <div class="or"><span>OR</span></div>
      <!-- sign in -->
      <a class="a-tips" @click.prevent="onToDoButton">Don't have an account? <strong>Click here</strong></a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginAPI } from "@/apis/app-api.js";
import { showDaisyAlert } from "@/utils/daisy-ui-alert.js";
import { showDaisyLoading, hiddenDaisyLoading } from "@/utils/daisy-ui-loading.js";
const router = useRouter();

const userName = ref("admin");
const password = ref("admin");

/** 判断用户身份然后登录到应用中，并存入全局的身份信息. */
const onLogin = async () => {
  // 限制操作
  showDaisyLoading();
  const res = await loginAPI(userName.value, password.value);
  if (!res.flag) {
    showDaisyAlert({ type: "error", message: `Login failed: ${res.log}` });
    hiddenDaisyLoading();
    return;
  }

  showDaisyAlert({ type: "success", message: `Login successfully!` });
  router.push({ path: "/chat" });
  hiddenDaisyLoading();
};

const onToDoButton = () => {
  showDaisyAlert({ type: "info", message: "This is a test function which is waiting for further development! 😄" });
};
</script>
