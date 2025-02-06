/**
 * 表示聊天信息存储的对象。
 */
export const ChatState = {
  /**
   * 用户的全部对话
   * @type {Array}
   */
  chatNameList: [],

  /**
   * 当前用户能够使用的全部对话模型列表
   * @type {object} 这里简单的给出了一个模型的参数
   */
  modelList: [
    {
      modelName: "",
      modelType: "",
      maxTokens: "",
    },
  ],

  /**
   * 当前对话的参数
   * @type {object}
   */
  chatParams: {
    chatName: "",
    modelType: "",
    modelName: "",
    maxTokens: 0,
    prompts: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are GPT-4o a large language model of OpenAI.",
          },
        ],
      },
    ],
    passedMsgLen: 20,
    maxResponseTokens: 2000,
    temperature: 0.7,
    topP: 0.95,
    frequecyPenaty: 0,
    presentPenaty: 0,
    stopSequence: [],
    timeout: 10,
  },

  /**
   * 当前对话消耗的 tokens 数量。
   * @type {number}
   */
  tokens: 0,

  /**
   * 对话过程中的唯一标志，用于访问数据库。
   * @type {string}
   */
  chatCid: "",

  /**
   * 是否处于编辑聊天参数的状态。
   * @type {boolean}: 是否在修改的状态
   */
  isEditChatSettings: false,

  /**
   * 直接强制更新对话, 清空或者初始化用
   * @param {list} data
   */
  setChatNameList(data) {
    this.chatNameList = data;
  },

  /**
   * 新增对话
   * @param {object} data - 对话的对象 包括名称和chatCid
   */
  pushChatName(data) {
    this.chatNameList.push(data);
  },

  /** 根据chatCid编辑对话的名称 */
  editChatNameList(data) {
    const index = this.chatNameList.findIndex((item) => item.chatCid === data.chatCid);
    this.chatNameList[index].chatName = data.chatName;

    // 同时判断一下是不是改的当前的对话的名称
    if (data.chatCid == this.chatCid) {
      this.chatParams.chatName = data.chatName;
    }
  },

  /** 根据chatCid删除对话*/
  deleteChatNameList(data) {
    const index = this.chatNameList.findIndex((item) => item.chatCid === data);
    if (index !== -1) this.chatNameList.splice(index, 1);
  },

  /**
   * 设置对话历史。
   * @param {Array<Object>} data - 对话模型的对象数组
   */
  setModelList(data) {
    this.modelList = data;
  },

  /**
   * 重置当前的对话的参数信息
   * @param {object} data - 要更新的数据
   */
  resetChatParams(data) {
    // 循环键值对赋值,更新对话的参数
    Object.keys(data).forEach((key) => {
      this.chatParams[key] = data[key];
    });
  },

  /**
   * 设置当前对话消耗的 tokens 数量。
   * @param {number} data - tokens 数量。
   */
  setTokens(data) {
    this.tokens = data;
  },

  /**
   * 设置对话的唯一标志。
   * @param {string} data - 对话标志 ID。
   */
  setChatCid(data) {
    this.chatCid = data;
  },

  /**
   * 设置是否处于编辑聊天参数的状态。
   * @param {number} data - 新的编辑状态。
   */
  setEditChatSettings(data) {
    this.isEditChatSettings = data;
  },
};
