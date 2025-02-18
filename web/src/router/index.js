import { createRouter, createWebHashHistory } from "vue-router";
import LoginPage from "@/views/home/LoginPage.vue";
import HomePage from "@/views/home/HomePage.vue";
import ChatPage from "@/views/chat/HomePage.vue";

const router = createRouter({
  history: createWebHashHistory(),
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
      path: "/home",
      component: HomePage,
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
