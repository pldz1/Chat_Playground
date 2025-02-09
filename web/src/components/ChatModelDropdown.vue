<template>
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn m-1 btn-color1">
      对话模型: 无
      <div v-html="downIcon"></div>
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      <li v-for="model in chatModels" :key="model.id">
        <a>{{ model.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { downIcon } from "@/assets/image/global-svgs";

const store = useStore();
const chatModels = computed(() => store.state.user.chatModels);
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
