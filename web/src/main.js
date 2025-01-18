import { createApp } from "vue";
import App from "./App.vue";

/**
 * 如何在vue3.0项目中集成Element-plus
 * https://blog.csdn.net/weixin_47450807/article/details/123262703
 */
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

/**
 * 使用vue3的路由
 * https://juejin.cn/post/7143890189524402183
 */
import router from "./router/index.js";

/**
 * 使用vuex实现存储全局变量
 * https://vuex.vuejs.org/zh/
 */
import store from "./store/index.js";

// 引入自定义全局样式文件
import "./assets/global.css";

const app = createApp(App);
app.use(store);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
