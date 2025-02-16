<template>
  <div class="tooltip tooltip-bottom" data-tip="用户设置">
    <div class="avatar placeholder" :class="{ online: isLoggedIn, offline: !isLoggedIn }" @click="onShowUserSettingOverlay">
      <div class="bg-neutral text-neutral-content rounded-full hb-wh2">
        <span class="text-xl">{{ username }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const username = computed(() => (store.state.username ? store.state.username.slice(0, 2).toUpperCase() : "游客"));
const isLoggedIn = computed(() => store.state.isLoggedIn);
</script>

<style scoped>
.avatar {
  height: 48px;
  width: 48px;
  min-height: 48px;
  cursor: pointer;
}
</style>
