import chromep from "chrome-promise";
import Tab = chrome.tabs.Tab;
import { reloadExtension } from "./components/reloadExtension";

console.log("this is background");
let isDrawingMode: boolean = false;

chrome.runtime.onInstalled.addListener(async details => {
  //await notifiCate("拡張機能がインストールされました!").catch((error) => {console.log(error)});
  chrome.browserAction.enable();
  //モードの初期値を設定
  await chromep.storage.local.set({ mode: false }).catch(e => console.log(e));
  await stopDrawing();
});

const startDrawing = async () => {
  await chromep.storage.local.set({ mode: true }).catch(e => console.log(e));
  chrome.browserAction.setBadgeText({ text: "ON" });
};

const stopDrawing = async () => {
  await chromep.storage.local.set({ mode: false }).catch(e => console.log(e));
  chrome.browserAction.setBadgeText({ text: "" });
};

//拡張機能のボタンを押すとお絵かきモードが起動
chrome.browserAction.onClicked.addListener(tab => {
  if (
    chrome.runtime.lastError &&
    chrome.runtime.lastError.message.match(/cannot be scripted/)
  ) {
    window.alert("It is not allowed to use this extension in this page.");
    chrome.browserAction.disable();
    reloadExtension();
  }

  if (isDrawingMode != true) {
    startDrawing();
  } else {
    stopDrawing();
  }
  isDrawingMode = !isDrawingMode;
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const msg = message;
  if (msg.tag === "getImg") {
    const request = await fetch(msg.body.url as string, {
      method: "GET",
      mode: "cors"
    });
    const svg = await request.text();
    const response = {
      tag: "insertSVG",
      body: svg
    };
    const activeTab = (await chromep.tabs.query({ active: true })) as Tab[];
    const targetId = activeTab[0].id;
    chrome.tabs.sendMessage(targetId, response);
  }
});
