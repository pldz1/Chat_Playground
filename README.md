# 🎨 AIGC Playground

**AIGC Playground**，希望用这个项目工具，体验各种好玩的 AI 功能，像与 AI 对话、AI 图像等等！

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

## 🖼️ 图像生成（建设中...🥱）

- 🌈 **Dalle 模型加持**：只支持 Dalle 模型
- ✏️ **图像编辑 & 变化**：功能还在开发... ...
