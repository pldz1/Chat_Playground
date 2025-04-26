<template>
  <dialog id="global_image_preview_modal" class="modal global-image-preview-modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 close-forum" @click="handleClose">✕</button>
      </form>

      <img class="img-container" :src="imgSrc" />
    </div>
  </dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const imgSrc = computed(() => store.state.modalImgSrc);
</script>

<style lang="scss" scoped>
.global-image-preview-modal {
  .modal-box {
    max-width: 100vw;
    max-height: 100vh;
    height: 100vh;
    width: 100vw;
    background-color: #00000052;
    box-shadow: initial;
    overflow: hidden;
  }

  .close-forum {
    background-color: transparent;
    color: white;
    font-size: 36px;
  }

  .img-container {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}
</style>
