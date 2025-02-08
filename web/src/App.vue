<template>
  <router-view />
  <input id="gloal-file-upload-input" type="file" style="display: none" />
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  position: absolute;
  width: 100vw;
  height: 100vh;
  min-height: 400px;
  font-family: "Microsoft YaHei";
  overflow: hidden;
  background-color: inherit;
  border-radius: 8px;
  /* 允许在webview中拷贝文字 */
  user-select: text;
}
</style>
