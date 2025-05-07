<template>
  <div class="gusm-any-settings-container">
    <!-- 新版本下载地址 -->
    <div class="gusm-any-settings-row">
      <span>🆕 查看新版本: </span>
      <a class="link link-success" href="https://github.com/pldz1/AIGC_Playground/releases" target="_blank" rel="noopener noreferrer"> GitHub Release </a>
    </div>

    <!-- 有的没有的设置 -->
    <div class="gusm-any-settings-row">
      <span>🎨 默认主题: </span>
      <span>懒得做这个功能了 🥱</span>
    </div>

    <!-- 服务器的地址 -->
    <div class="gusm-any-settings-row">
      <span>⚠️ 服务器地址: </span>
      <input type="text" placeholder="http://127.0.0.1:10088" class="input input-bordered w-full max-w-xs" disabled />
    </div>

    <!-- 导出配置 -->
    <div class="gusm-any-settings-row">
      <span>💾 导出配置为JSON文件: </span>
      <button class="btn btn-back-login" @click="onSaveSetting">导出配置</button>
    </div>

    <!-- 导入配置 -->
    <div class="gusm-any-settings-row">
      <span>📥 导入JSON文件为设置: </span>
      <button class="btn btn-back-login" @click="onLoadSetting">导入配置</button>
    </div>

    <!-- 登录界面 -->
    <div class="gusm-any-settings-row">
      <button class="btn btn-outline btn-error btn-back-login" @click="onBackLogin">返回登陆界面</button>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getModels, setModels } from "@/services";
import { uploadJsonFile, isValidModelSetting, dsAlert } from "@/utils";

const store = useStore();
const router = useRouter();

/**
 * 触发下载当前模型设置为 JSON 文件
 * @async
 * @returns {Promise<void>}
 */
const onSaveSetting = async () => {
  const jsonData = await getModels(false);

  // 创建 JSON 字符串并打包成 Blob
  const jsonStr = JSON.stringify(jsonData, null, 2); // 美化格式
  const blob = new Blob([jsonStr], { type: "application/json" });

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aigc_mode_setting.json"; // 下载文件名
  document.body.appendChild(a);
  a.click();

  // 清理
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * 处理用户上传 JSON 文件，并验证和应用模型设置
 * @async
 * @returns {Promise<void>}
 */
const onLoadSetting = async () => {
  const jsonData = await uploadJsonFile();
  if (!jsonData) {
    dsAlert({ type: "error", message: `读取json文件失败` });
    return;
  } else {
    const isValid = isValidModelSetting(jsonData);
    if (!isValid) {
      dsAlert({ type: "error", message: `不是有效的模型设置json文件` });
      return;
    } else {
      // 更新store
      await store.dispatch("setModels", jsonData);
      // 保存到数据库
      await setModels(jsonData);
    }
  }
};

/**
 * 返回登录页面并清除登录状态
 */
const onBackLogin = () => {
  router.push({ path: "/login" });
  store.dispatch("login", null);
};
</script>

<style lang="scss" scoped>
.gusm-any-settings-container {
  gap: 8px;
  display: flex;
  flex-direction: column;

  .gusm-any-settings-row {
    height: 48px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 16px;
    padding: 8px;
    align-items: center;
  }

  .btn-back-login {
    height: 36px;
    min-height: 0px;
  }
}
</style>
