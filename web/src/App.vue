<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  min-height: 400px;
  font-family: "Microsoft YaHei";
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 8px;
  /* 允许在webview中拷贝文字 */
  user-select: text;
}
</style>
