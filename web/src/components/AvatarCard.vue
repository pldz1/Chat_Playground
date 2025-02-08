<template>
  <div class="avatar online placeholder" @click="onShowUserSettingOverlay">
    <div class="bg-neutral text-neutral-content rounded-full hb-wh2">
      <span class="text-xl">AI</span>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.avatar {
  height: 48px;
  width: 48px;
  min-height: 48px;
  cursor: pointer;
}
</style>
