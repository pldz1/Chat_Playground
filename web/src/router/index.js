import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/home/LoginPage.vue";
import ChatPage from "@/views/chat/HomePage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // 默认打开跳转路由
      // https://juejin.cn/post/7195183916481773624
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/chat",
      component: ChatPage,
    },
    {
      path: "/chat/:id",
      component: ChatPage,
      props: true,
    },
  ],
});
export default router;
