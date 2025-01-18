<template>
  <div class="component-chat-input-area">
    <div class="input-card" id="chat-input-card">
      <el-button class="attach-button" @click="uploadImageFile">
        <!-- pause chat button -->
        <div class="icon" v-html="``"></div>
      </el-button>
      <div class="input-area">
        <div class="imgs" id="chat-input-imgs"></div>
        <el-input
          class="custom-textarea"
          type="textarea"
          placeholder="Please input your question ..."
          @keydown.enter=""
          :autosize="{ minRows: 1, maxRows: 4 }"
        ></el-input>
      </div>
      <!-- send and pause button -->
      <el-button class="send-button" @click="">
        <!-- send chat button -->
        <div v-if="!isChatting" :class="['svg-icon', { 'svg-icon-disable': userQuestionText == '' }]" v-html="``"></div>
        <!-- pause chat button -->
        <div v-else class="svg-icon" v-html="``"></div>
      </el-button>
    </div>
  </div>
</template>

<script setup></script>
