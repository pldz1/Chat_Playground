# 🎨 Chat Playground v1

**Chat Playground v1**，希望用这个项目工具，体验各种好玩的 AI 功能，像与 AI 对话、AI 图像等等！

**v1 版本支持了对话和图像, 对于语音这些都没有做实现, 但是决定不再继续更新 v1 版本, v1 版本想尽可能的把代码简单, 容易理解, 方便有兴趣的小伙伴, 能够随意的 fork 这个分支去做自己的功能开发**

v1 的网页的开发框架用的是 Vue3, UI 库用的是 [Daisyui v4](https://v4.daisyui.com/)

v1 版本对 API 的调用都是用 JavaScript 上入手的

v1 版本对于 Python 只是提供一个存储 Sqlite 和 web server 的功能

---

## 👀 效果预览

直接点击 【Experience it first! 🚀】 开始预览在线网页, 然后导入配置进行玩耍也行

👉 在线体验地址: [pldz1.com](https://pldz1.com/io/chat-playground-v1)

![v1效果预览](https://pldz1.com/api/v1/website/image/code-space/chat-playground_v1_preview.gif)

---

## 🚀 技术实现

为了简化并灵活调用各种 AI 能力，我将项目设计成了如下结构：

- 🌐 **客户端(JS 端)**：向真实服务器请求 AI 能力
- ⚙️ **真实服务器**：调用对应的 AI API 并返回结果
- 📦 **客户端(JS 端)**：收到结果后再交由项目的服务器(python 端)进行进一步处理

这样设计，主要是用 JS 来调用各种真实的 AI 接口，这个有好处就是 Client 如果打成静态网页也能预览显示的效果，但是 JS 的各种针对系统的接口就没有用 Python 的方便了, 暂时这样设计

---

## 💬 对话功能

- 🎉 **支持多种 API 库**：目前已接入 OpenAI、Azure OpenAI 和 DeepSeek 的 API
- 🧠 **思考能力 UP！** 现在对话已经可以调用 reasoning 模型
- 🔄 **兼容多种消息格式**：
  - v1 格式: `[{ role: "user", content: "你好AI！" }]`
  - v2 格式: `[{ role: "user", content: [{ type: "text", text: "你好AI！" }] }]`
- ✨ **动态渲染 Markdown**：动态渲染 Markdown

---

## 🖼️ 图像生成

- 🌈 **Dalle 模型加持**：只支持 Dalle 模型

---
