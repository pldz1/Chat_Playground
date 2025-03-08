<template>
  <div class="chat-template-display-card">
    <div class="ctdc-typewriter"><img src="/hello.gif" /></div>
    <div class="ctdc-templates">
      <div class="ctdc-templates-container">
        <button v-for="inst in insTemplateList" :key="inst.id" class="btn" @click="onSelectInst(inst.id)">
          {{ inst.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { chatInsTemplateList } from "@/constants";
import { addChat } from "@/services";
import { dsAlert, append4Random } from "@/utils";

const emit = defineEmits(["on-update"]);

const store = useStore();
const curChatModelSettings = computed(() => store.state.curChatModelSettings);
const insTemplateList = computed(() => {
  return [...chatInsTemplateList, ...store.state.chatInsTemplateList];
});

const onSelectInst = async (id) => {
  const instObj = insTemplateList?.value?.find((inst) => inst.id === id);
  if (!instObj) {
    dsAlert({ type: "error", message: "无效的对话模板指令!" });
    return;
  }

  const newVal = { ...curChatModelSettings.value };
  newVal.prompts[0].content[0].text = instObj.value;
  await store.dispatch("setCurChatModelSettings", newVal);

  const name = append4Random(instObj.name);
  await addChat(name);

  emit("on-update", [
    { role: "user", content: [{ type: "text", text: "重复一遍你的指令" }] },
    { role: "assistant", content: [{ type: "text", text: instObj.value }] },
  ]);
};
</script>

<style lang="scss" scoped>
.chat-template-display-card {
  position: absolute;
  left: 10%;
  width: 80%;
  max-width: 80%;
  height: calc(100% - 128px);
  z-index: 200;
  background-color: transparent;
  padding: 20px;
  display: flex;
  overflow: hidden;

  .ctdc-typewriter {
    position: absolute;
    left: 20%;
    top: 30%;
    width: 60%;
    font-size: 2em;
    white-space: pre;
    color: oklch(var(--bc));
    text-align: center;
  }
  .ctdc-templates {
    position: relative;
    left: 15%;
    top: 55%;
    width: 70%;
    height: 30%;
    max-height: 30%;

    .ctdc-templates-container {
      position: relative;
      height: 100%;
      width: 100%;
      overflow-y: auto;

      .btn {
        margin: 4px;
        font-size: 1rem;
        height: 48px;
        max-height: 48px;
      }
    }
  }
}
</style>
