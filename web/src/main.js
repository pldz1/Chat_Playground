import { createApp } from "vue";
import App from "./App.vue";

/**
 * 如何在vue3.0项目中集成Element-plus
 * https://blog.csdn.net/weixin_47450807/article/details/123262703
 */
import ElementPlus from "element-plus";
/**
 * 引入element plus的icon
 * https://element-plus.org/zh-CN/component/icon.html
 */
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
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
import "./assets/styles/global.css";
import "highlight.js/styles/atom-one-dark.css";

import "./helper/global.js";

const app = createApp(App);

for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component);
}
app.use(store);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
