import ChatItemHelper from "./item.js";
import StoreHelper from "@/store/store-helper";
import { showMessage } from "@/utils/custom-message.js";
// import { getUserMsg } from "./message.js";
import { addNewChatAPI, setUserMsgAPI, setChatParamsAPI, getSpecChatHistoryAPI } from "../../apis/chat.js";

class ChatCardHelper extends ChatItemHelper {
  static instance = null;

  constructor() {
    super();
    if (ChatCardHelper.instance) {
      throw new Error("我是单例 用 ChatCardHelper.getInstance() 来调我");
    }
    this._isListenerActive = false;
  }

  static getInstance() {
    if (!ChatCardHelper.instance) {
      ChatCardHelper.instance = new ChatCardHelper();
    }
    return ChatCardHelper.instance;
  }

  /** _mouseMoveLister 是鼠标移动到对话的HTMLElement上要处理显示Options的函数 */
  _mouseMoveLister = (event) => {
    const targetClass = event.target.closest(".user-content, .assistant-content");
    if (targetClass) {
      const optionButtons = targetClass.querySelectorAll(".options-button");
      optionButtons.forEach((div) => {
        div.classList.add("active");
      });
    }
  };

  /** _mouseMoveLister 是鼠标移出了对话的HTMLElement上要处理隐藏Options的DIV的函数 */
  _mouseOutLister = () => {
    const activeOptionButtons = document.querySelectorAll(".options-button.active");
    activeOptionButtons.forEach((div) => {
      div.classList.remove("active");
    });
  };

  /** _newChat 是个特殊函数, 用来给没有设置任何参数的情况下 直接用默认参数开始一个新的对话,
   *  返回一个chatCid, 如果是 '' 就表示没有得到正确的对话参数! */
  async getValidChatCid() {
    var tmpChatCid = StoreHelper.getChatCid();
    var chatCid = tmpChatCid !== "" ? tmpChatCid : "";

    // 没有新建对话需要新建对话
    if (chatCid == "") {
      var rea = await addNewChatAPI();
      if (!rea.flag) {
        showMessage("error", `初始化对话参数和数据库失败! 【${rea.log}】 🤡`);
        return "";
      }

      // 得到chatCid
      chatCid = rea.chatCid;
      //  切换chatCid的时候 已经从SERVER更新过参数了
      var chatParams = StoreHelper.getChatParams();
      rea = await setChatParamsAPI(chatCid, chatParams);
      if (!rea.flag) {
        showMessage("error", `设置对话参数失败!【${rea.log}】 退出对话. `);
        return "";
      }

      // 🎉 有效的ChatCid, 新建对话成功！ 存入store
      StoreHelper.setChatCid(chatCid);
      StoreHelper.pushChatName(chatCid, chatParams.chatName);
    }

    return chatCid;
  }

  /** addListener 是给显示对话消息的界面增加鼠标移动事件的监听器, 单例 必须保证事件监听器的开关是挂锁的 */
  addListener = () => {
    if (!this._init()) return;
    if (this._isListenerActive) return;
    this._chatContainer.addEventListener("mouseover", this._mouseMoveLister);
    this._chatContainer.addEventListener("mouseout", this._mouseOutLister);
    this._isListenerActive = true;
  };

  /** removeListener 是移除对话消息的界面的鼠标移动事件监听器*/
  removeListener = () => {
    if (!this._init()) return;
    if (!this._isListenerActive) return;
    this._chatContainer.removeEventListener("mouseover", this._mouseMoveLister);
    this._chatContainer.removeEventListener("mouseout", this._mouseOutLister);
    this._isListenerActive = false;
  };

  /** drawChatHistory 绘制对话的历史到网页上 */
  drawChatHistory(data) {
    data.forEach((item) => {
      if (item.message.role == "user") this._addUserQHTMLElem(item.chatIid, item.message.content);
      else this._addAssHTMLElem(item.chatIid, item.message.content[0].text);
    });
  }

  /** initChatHistory 会在初始化时候从SERVER加载的对话历史渲染消息到`ChatCard.vue`上 */
  initChatHistory = async (chatCid) => {
    if (!this._init()) return;
    this.removeAllElem();
    // 新对话 清空DIV就返回了
    if (chatCid === "") return;
    this.addListener();
    var rea = await getSpecChatHistoryAPI(chatCid);
    if (rea.flag) {
      this.drawChatHistory(rea.history);
      return rea.tokens;
    }
    return 0;
  };

  /** sendChat ⭐⭐ 发送对话给到SERVER然后获得来自SERVER返回的Assistant的回答, 输出到网页上
   * 要注意的是, 这个函数也会提取判断是不是新建对话.*/
  async sendChat(texts, callback) {
    this.removeListener();

    var chatCid = await this.getValidChatCid();
    // 没有得到正确的对话参数 不处理对话
    if (chatCid == "") return;

    var message = getUserMsg(texts);
    var rea = await setUserMsgAPI(message);
    if (!rea.flag) {
      showMessage("error", `SERVER 处理用户问题出错! 【${rea.log}】 🤡`);
      return;
    }

    // 更新UI和tokens
    this._addUserQHTMLElem(rea.chatIid, message.content);
    StoreHelper.setTokens(rea.tokens);

    // 开始更新Assistant的回答
    await this._getAssistantResponse(chatCid, callback);

    this.addListener();
  }

  /** stopChat ⭐⭐ 用信号暂停/取消SSE */
  async stopChat() {
    this.ctrl.abort();
  }
}

/** @type ChatCardHelper  */
const chatCardHandler = ChatCardHelper.getInstance();
export default chatCardHandler;
