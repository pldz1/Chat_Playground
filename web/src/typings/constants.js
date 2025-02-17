export const apiTypeList = [
  { value: "OpenAI", name: "OpenAI" },
  { value: "Azure OpenAI", name: "Azure OpenAI" },
];

export const chatModelTypeList = [
  { value: "gpt-4o", name: "gpt-4o" },
  { value: "gpt-4o-mini", name: "gpt-4o-mini" },
  { value: "gpt-4", name: "gpt-4" },
  { value: "gpt-4-turbo", name: "gpt-4-turbo" },
  { value: "gpt-3.5", name: "gpt-3.5" },
  { value: "gpt-3.5-turbo", name: "gpt-3.5-turbo" },
  { value: "o1", name: "o1" },
  { value: "o1-pro", name: "o1-pro" },
  { value: "o3-mini", name: "o3-mini" },
  { value: "o3-mini-high", name: "o3-mini-high" },
  { value: "deepseek-v3", name: "deepseek-v3" },
  { value: "deepseek-r1", name: "deepseek-r1" },
];

export const imageModelTypeList = [
  { value: "dalle2", name: "dalle2" },
  { value: "dalle3", name: "dalle3" },
];

export const rtaudioModelTypeList = [
  { value: "gpt-4o-realtime-preview", name: "gpt-4o-realtime-preview" },
  { value: "gpt-4o-mini-realtime-preview", name: "gpt-4o-mini-realtime-preview" },
];

export const chatInsTemplateList = [
  {
    id: "inst-m77grbkj-aktc-4gj7",
    name: "🔤 翻译助手",
    value:
      "你是一个高级的翻译助手 如果我输入了中文 请你给我翻译为英语, 要求符合语境，如果里面包含一些特殊行业的名词，请给出你进行推断,要求你只输出翻译的结果, 和翻译中的关键点,需要你详细的列出来,符合要求,同理如果我输出了中文,请你也同样按照这样翻译成英语。",
  },
  {
    id: "inst-m77greuw-e5up-tqzb",
    name: "🥳 Git emoji助手",
    value:
      "你是一个git commit的写手, 把我给到你的信息 输出成一句英文的git commit并且带上emoji, 请注意 是一句结果即可, 其中的emoji的功能是这样的：🎨:结构改进/格式化代码。⚡️:性能改善。🔥:删除代码或者文件。🐛:修了一个BUG。🚑:重大热修复。✨:引入新的特性。📝:写文档。🚀:部署相关。💄:更新界面与样式文件。🎉:创世提交。✅:更新测试。🔒:修复安全问题。🍎:修复在苹果系统上的问题。🐧:修复在Linux系统上的问题。🏁:修复在Windows系统上的问题。🤖:修复在安卓系统上的问题。🍏:修复在iOS系统上的问题。🔖:发布/版本标签。🚨:消除linter警告。🚧:进行中。💚:修复持续集成构建。⬇️:降级依赖。⬆️:升级依赖。📌:固定依赖在特定的版本。👷:添加持续集成构建系统。📈:添加分析或者跟踪代码。♻️:代码重构。🐳:Docker容器相关。➕:添加依赖。➖:删除依赖。🔧:改变配置文件。🌐:国际化与本地化。✏️:修正拼写错误。💩:写需要改进的坏代码。⏪:回滚改动。🔀:合并分支。📦:更新编译后的文件或者包。👽:由于外部API变动而更新代码。🚚:文件移动或者重命名。📄:添加或者更新许可。💥:引入破坏性的改动。🍱:添加或者更新静态资源。👌:代码审核后更新代码。♿️:改进可访问性。💡:给源代码加文档。🍻:醉写代码。💬:更新文本和字面。🗃:执行数据库相关的改动。🔊:添加日志。🔇:删除日志。👥:添加贡献者（们）。🚸:改进用户体验/可用性。🏗:架构改动。📱:响应性设计相关。🤡:模拟相关。🥚:添加一个彩蛋。🙈:添加或者更新.gitignore文件。📸:添加或者更新快照。⚗:研究新事物。🔍:改进搜索引擎优化。☸️:Kubernetes相关的工作。🏷️:添加或者更新类型（Flow,TypeScript）。",
  },
];

export const imageModelSize = [
  { name: "1024x1024", value: "1024x1024" },
  { name: "1024x1792", value: "1024x1792" },
  { name: "1792x1024", value: "1792x1024" },
];
