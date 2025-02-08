<template>
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn m-1 btn-color1">
      对话模型: 无
      <div v-html="downIcon"></div>
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      <li><a>Item 1</a></li>
      <li><a>Item 2</a></li>
    </ul>
  </div>
</template>

<script setup>
import { downIcon } from "@/assets/image/global-svgs";
</script>

<style lang="scss" scoped>
.btn-color1 {
  background-color: oklch(var(--b1));
  box-shadow: initial;
  border-color: transparent;

  &:hover {
    background-color: oklch(var(--b2));
  }
}
</style>
