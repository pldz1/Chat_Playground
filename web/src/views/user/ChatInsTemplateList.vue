<template>
  <div class="gusm-any-settings-container">
    <div class="overflow-x-auto gusm-tab-container">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Instruction</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(inst, index) in chatInsTemplateList" :key="inst.id">
            <th>{{ index + 1 }}</th>
            <td :class="isEditIndex !== index ? 'disabled' : ''">
              <input type="text" placeholder="" class="input input-bordered w-full max-w-xs" v-model="inst.name" @change="handleEdit" />
            </td>
            <td :class="isEditIndex !== index ? 'disabled' : ''">
              <textarea class="textarea textarea-bordered" placeholder="" v-model="inst.value" @change="handleEdit"></textarea>
            </td>
            <td>
              <div class="gusm-tab-option">
                <div class="tooltip" data-tip="编辑指令">
                  <button class="btn btn-circle btn-outline btn-accent" @click="onEdit(index)">
                    <div v-html="edit18"></div>
                  </button>
                </div>
                <div class="tooltip" data-tip="删除指令">
                  <button class="btn btn-circle btn-outline btn-error" @click="onDelete(index)">
                    <div v-html="delete18"></div>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="btn btn-error w-52" @click="addChatInst">
      <div v-html="add24"></div>
      新增对话指令模板
    </button>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { add24, delete18, edit18 } from "@/assets/svg";
import { append4Random, getUuid } from "@/utils";
import { setChatInsTemplateList } from "@/services";

const store = useStore();
const chatInsTemplateList = computed(() => store.state.chatInsTemplateList);

const isEditIndex = ref(-1);

const addChatInst = async () => {
  const tmpChatInsTemplateList = [...chatInsTemplateList.value];
  tmpChatInsTemplateList.push({
    id: getUuid("inst"),
    name: append4Random("新增指令模板"),
    value: "",
  });

  await store.dispatch("setChatInsTemplateList", tmpChatInsTemplateList);
  await setChatInsTemplateList(tmpChatInsTemplateList);
  isEditIndex.value = tmpChatInsTemplateList.length - 1;
};

const onDelete = async (index) => {
  const tmpChatInsTemplateList = [...chatInsTemplateList.value];
  tmpChatInsTemplateList.splice(index, 1);
  await store.dispatch("setChatInsTemplateList", tmpChatInsTemplateList);
  await setChatInsTemplateList(tmpChatInsTemplateList);
};

const onEdit = async (index) => {
  isEditIndex.value = index;
};

const handleEdit = async () => {
  const tmpChatInsTemplateList = [...chatInsTemplateList.value];
  await store.dispatch("setChatInsTemplateList", tmpChatInsTemplateList);
  await setChatInsTemplateList(tmpChatInsTemplateList);
};
</script>

<style lang="scss" scoped>
.gusm-any-settings-container {
  gap: 8px;
  display: flex;
  flex-direction: column;

  .gusm-tab-container {
    max-height: 400px;

    .disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }

  .gusm-tab-option {
    display: flex;
    flex-direction: row;
    gap: 8px;
    .btn {
      max-height: 24px;
      min-height: 24px;
      height: 24px;
    }
  }
}
</style>
