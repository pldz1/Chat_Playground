<template>
  <div class="home-login-container">
    <div class="container" v-loading="isLoading">
      <!-- header -->
      <h1>Welcome back</h1>
      <!-- userName & password -->
      <div class="form-group">
        <input v-model="userName" required />
        <label>User name*</label>
      </div>
      <div class="form-group">
        <input type="password" v-model="password" required />
        <label>Password*</label>
      </div>
      <!-- login button -->
      <button @click="onLogin">Login</button>

      <div class="or"><span>OR</span></div>
      <!-- sign in -->
      <a @click.prevent="onToDoButton"
        >Don't have an account? <strong>Click here</strong></a
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { isExeEnvAPI } from "../../apis/user.js";
import { login } from "@/services/user/common.js";
import { showMessage } from "@/utils/custom-message.js";

const router = useRouter();

const userName = ref("");
const password = ref("");
const isLoading = ref(false);

/** ====================== 下面定义函数 ====================== */
onMounted(async () => {
  const res = await isExeEnvAPI();

  const flag = res.flag
    ? await login(res.userName, res.userName)
    : await login();

  if (flag) {
    router.push({
      path:
        (res.flag ? res.userName : userName.value) === "admin"
          ? "/admin"
          : "/chat",
    });
  }
});

/** 判断用户身份然后登录到应用中，并存入全局的身份信息. */
const onLogin = async () => {
  // 限制操作
  isLoading.value = true;
  var flag = await login(userName.value, password.value);
  // 登录成功
  if (!flag) return;

  router.push({
    path: userName.value == "admin" ? "/admin" : "/chat",
  });
  isLoading.value = false;
};

const onToDoButton = () => {
  showMessage("info", "联系管理员获得登录凭证 😋");
};
</script>
