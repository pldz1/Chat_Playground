<template>
  <div>
    <el-dropdown trigger="click" popper-class="component-option-dropdown">
      <div class="svg-icon" v-html="optionsIcon"></div>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 各种选项的内容 -->
          <el-dropdown-item v-for="(item, index) in props.data" :key="index" @click.stop="onEmits(item.opt)">
            <div class="svg-icon" v-html="item.icon"></div>
            <el-text>{{ item.opt }}</el-text>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { optionsIcon } from "@/assets/image/chat-opt-svgs.js";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  data: {
    type: Array,
    default: () => [
      {
        icon: "",
        opt: "",
      },
    ],
  },
});

const emits = defineEmits(["on-update"]);

const onEmits = (opt) => {
  emits("on-update", props.id, opt);
};
</script>
