<template>
  <dialog id="global_chat_model_settings" class="modal global-chat-model-settings">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
      </form>
      <h3 class="text-lg font-bold">设置模型参数</h3>
      <!-- 设置主容器 -->
      <div class="gcms-container">
        <!-- 系统默认提示词 -->
        <div class="gcms-setting-item">
          <div class="gcms-setting-label">
            <span>Instructions</span>
            <div
              class="tooltip tooltip-bottom"
              data-tip="向模型提供关于其行为方式以及生成响应时应参考的任何上下文的说明。您可以描述助手的个性，告诉它应该和不应该回答什么，并告诉它如何格式化响应。此部分没有令牌限制，但它将包含在每次 API 调用中，因此它计入总令牌限制。"
            >
              <div v-html="info24"></div>
            </div>
          </div>

          <div class="gcms-setting-content">
            <textarea class="textarea textarea-bordered" v-model="instrStr"></textarea>
          </div>
        </div>

        <!-- 最大对话长度 -->
        <div class="gcms-setting-item">
          <div class="gcms-setting-label">
            <span>对话历史数量</span>
            <div
              class="tooltip tooltip-bottom"
              data-tip="选择每个新 API 请求中要包含的过去消息数量。这有助于为新用户查询提供模型背景。将此数字设置为 10 将包括 5 个用户查询和 5 个系统响应。"
            >
              <div v-html="info24"></div>
            </div>
          </div>
          <div class="gcms-setting-content">
            <input type="range" min="1" max="20" class="range range-xs" v-model.number="modelSettings.passedMsgLen" />
            <input type="text" class="input input-bordered" v-model.number="modelSettings.passedMsgLen" />
          </div>
        </div>

        <!-- 最大响应tokens -->
        <div class="gcms-setting-item">
          <div class="gcms-setting-label">
            <span>max_tokens</span>
            <div
              class="tooltip tooltip-bottom"
              data-tip="设置每个模型响应的标记数限制。提示（包括系统消息、示例、消息历史记录和用户查询）和模型响应之间共享支持的标记数。对于典型的英文文本，一个标记大约为 4 个字符。"
            >
              <div v-html="info24"></div>
            </div>
          </div>
          <div class="gcms-setting-content">
            <input type="range" min="0" max="12800" step="1" v-model.number="modelSettings.max_tokens" class="range range-xs" />
            <input type="text" class="input input-bordered" v-model.number="modelSettings.max_tokens" />
          </div>
        </div>

        <!-- temperature -->
        <div class="gcms-setting-item">
          <div class="gcms-setting-label">
            <span>temperature</span>
            <div
              class="tooltip"
              data-tip="控制随机性。降低温度意味着模型将产生更多重复性和确定性响应。升高温度将产生更多意外或创造性响应。尝试调整温度或 Top P，但不要同时调整两者。"
            >
              <div v-html="info24"></div>
            </div>
          </div>
          <div class="gcms-setting-content">
            <input type="range" min="0" max="1" step="0.01" v-model.number="modelSettings.temperature" class="range range-xs" />
            <input type="text" class="input input-bordered" v-model.number="modelSettings.temperature" />
          </div>
        </div>

        <!-- top_p -->
        <div class="gcms-setting-item">
          <div class="gcms-setting-label">
            <span>top_p</span>
            <div
              class="tooltip"
              data-tip="与温度类似，这会控制随机性，但使用不同的方法。降低 Top P 会将模型的标记选择范围缩小到更可能的标记。增加 Top P 会让模型从可能性高和低的标记中进行选择。尝试调整温度或 Top P，但不要同时调整两者。"
            >
              <div v-html="info24"></div>
            </div>
          </div>
          <div class="gcms-setting-content">
            <input type="range" min="0" max="1" step="0.01" v-model.number="modelSettings.top_p" class="range range-xs" />
            <input type="text" class="input input-bordered" v-model.number="modelSettings.top_p" />
          </div>
        </div>

        <!-- frequency_penalty -->
        <div class="gcms-setting-item">
          <div class="gcms-setting-label">
            <span>frequency_penalty</span>
            <div class="tooltip" data-tip="根据标记迄今为止在文本中出现的频率按比例减少重复标记的机会。这降低了在响应中重复完全相同文本的可能性。">
              <div v-html="info24"></div>
            </div>
          </div>
          <div class="gcms-setting-content">
            <input type="range" min="0" max="2" step="0.01" v-model.number="modelSettings.frequency_penalty" class="range range-xs" />
            <input type="text" class="input input-bordered" v-model.number="modelSettings.frequency_penalty" />
          </div>
        </div>

        <!-- presence_penalty -->
        <div class="gcms-setting-item">
          <div class="gcms-setting-label">
            <span>presence_penalty</span>
            <div class="tooltip" data-tip="减少重复迄今为止在文本中出现的任何标记的机会。这增加了在响应中引入新主题的可能性。">
              <div v-html="info24"></div>
            </div>
          </div>
          <div class="gcms-setting-content">
            <input type="range" min="0" max="2" step="0.01" v-model.number="modelSettings.presence_penalty" class="range range-xs" />
            <input type="text" class="input input-bordered" v-model.number="modelSettings.presence_penalty" />
          </div>
        </div>

        <!-- stop -->
        <div class="gcms-setting-item">
          <div class="gcms-setting-label">
            <span>stop</span>
            <div
              class="tooltip"
              data-tip="让模型在所需的点结束其响应。模型响应将在指定序列之前结束，因此它不会包含停止序列文本。对于 ChatGPT，使用 <|im_end|> 可确保模型响应不会生成后续用户查询。您最多可以包含四个停止序列。"
            >
              <div v-html="info24"></div>
            </div>
          </div>
          <div class="gcms-setting-content">
            <textarea class="textarea textarea-bordered" v-model="stopStr"></textarea>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, reactive, watch, ref } from "vue";
import { info24 } from "@/assets/svg";
import { isArrayTypeStr, dsAlert } from "@/utils";
import { setChatSettings } from "@/services";

const store = useStore();
const curChatModelSettings = computed(() => store.state.curChatModelSettings);
const modelSettings = reactive({});

const instrStr = ref("");
const stopStr = ref("");

watch(
  () => curChatModelSettings.value,
  (newVal) => {
    Object.keys(modelSettings).forEach((key) => {
      delete modelSettings[key];
    });
    Object.assign(modelSettings, newVal);

    instrStr.value = newVal.prompts[0].content[0].text || "";
    stopStr.value = JSON.stringify(newVal.stop);
  },
  { immediate: true, deep: true },
);

// 定义模态框关闭时的事件处理函数
const handleClose = async () => {
  modelSettings.prompts[0].content[0].text = instrStr.value;
  const validStop = isArrayTypeStr(stopStr.value);

  if (!validStop) dsAlert({ type: "warn", message: "没有输入有效的stop参数,默认置为空数组" });

  modelSettings.stop = validStop ? JSON.parse(stopStr.value) : [];

  // 保存全部修改
  store.dispatch("setCurChatModelSettings", { ...modelSettings });
  await setChatSettings();
};
</script>

<style lang="scss" scoped>
.global-chat-model-settings {
  overflow: hidden;
  .modal-box {
    width: 600px;
    max-width: unset;
  }

  .gcms-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    max-height: 450px;
    padding: 8px;
    overflow-y: auto;
  }

  .gcms-setting-item {
    display: flex;
    flex-direction: row;
    width: 528px;
    max-width: 528px;
    align-items: center;
    gap: 16px;
  }

  .gcms-setting-label {
    width: 180px;
    max-width: 180px;
    font-size: 16px;
    text-align: right;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  .gcms-setting-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 348px;
    gap: 8px;

    .textarea {
      width: 100%;
    }

    .input {
      width: 80px;
      max-width: 80px;
    }
  }
}
</style>
