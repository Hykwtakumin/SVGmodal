import chromep from "chrome-promise";
import Tab = chrome.tabs.Tab;

console.log("this is background");

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const msg = message;
    if (msg.tag === "getImg") {
        const request = await fetch(msg.body.url as string, {method: 'GET', mode: 'cors'});
        const svg = await request.text();
        const response = {
            tag: "insertSVG",
            body: svg
        };
        const activeTab = await chromep.tabs.query({active: true}) as Tab[];
        const targetId = activeTab[0].id;
        chrome.tabs.sendMessage(targetId, response);
    }
});