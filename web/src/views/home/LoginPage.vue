<template>
  <div class="home-login-container">
    <div class="container">
      <!-- header -->
      <h1 class="title">Welcome back</h1>
      <!-- username & password -->
      <div class="form-group">
        <input class="form-input" v-model="username" required />
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { loginAPI } from "@/apis/app-api.js";
import { dsAlert } from "@/utils/daisy-ui/alert.js";
import { dsLoading } from "@/utils/daisy-ui/loading.js";

const store = useStore();
const router = useRouter();

const username = ref("admin");
const password = ref("admin");

/** 判断用户身份然后登录到应用中，并存入全局的身份信息. */
const onLogin = async () => {
  // 限制操作
  dsLoading(true);
  const res = await loginAPI(username.value, password.value);
  if (!res.flag) {
    dsAlert({ type: "error", message: `Login failed: ${res.log}` });
    dsLoading(false);
    return;
  }

  dsAlert({ type: "success", message: `Login successfully!` });
  await store.dispatch("login", username.value);
  router.push({ path: "/chat" });
  dsLoading(false);
};

const onToDoButton = () => {
  dsAlert({ type: "info", message: "This is a test function which is waiting for further development! 😄" });
};
</script>
