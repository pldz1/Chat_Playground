<template>
  <div class="chat-roles-card">
    <div class="container">
      <div class="role-group">
        <div class="role-card" @click="uploadJsonFile">
          <el-tooltip content="Upload chat history with default model parameters" placement="bottom" :show-after="500">
            <div class="tips" v-html="SVGS.roleTipsSettings"></div>
          </el-tooltip>

          <div class="icon" v-html="SVGS.roleUploadIcon"></div>
          <el-text class="label">Upload History</el-text>
        </div>
        <div class="role-card" @click="newGhostChat(ghostTemplate.translate)">
          <el-tooltip content="中英互译助手" placement="bottom" :show-after="500">
            <div class="tips" v-html="SVGS.roleTipsGhost"></div>
          </el-tooltip>

          <div class="icon" v-html="SVGS.roleTranslateIcon"></div>
          <el-text class="label">Translate helper</el-text>
        </div>
        <div class="role-card" @click="newGhostChat(ghostTemplate.gitCommitHelper)">
          <el-tooltip content="git commit和git emoji的助手" placement="bottom" :show-after="500">
            <div class="tips" v-html="SVGS.roleTipsGhost"></div>
          </el-tooltip>

          <div class="icon" v-html="SVGS.roleGitCommitIcon"></div>
          <el-text class="label">Git Commit Helper</el-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as SVGS from "@/assets/image/chat-svgs.js";
import { newGhostChat } from "@/services/chat/common";
import { uploadJsonFile } from "@/services/user/files.js";

const ghostTemplate = {
  translate: {
    template: `translate`,
    msg: `好的, 我是一个中英互译助手, 请开始输入中文或者英文，我会为你进行翻译并列出翻译中的关键 😎`,
    name: `👻 中英互译助手`,
  },
  gitCommitHelper: {
    template: `gitCommitHelper`,
    msg: `好的, 我是一个git commit定制化的助手, 请开始输入你的commit 👻`,
    name: `👏 git commit 助手`,
  },
};
</script>
