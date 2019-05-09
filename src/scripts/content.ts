import { openCanvas, closeCanvas } from "./components/openCanvas";
import { getPagesWithImage } from "./components/UseScrapbox";
import { TitleImageMap } from "./components/utils";

window.onload = async () => {
  console.log("content script");
  const observer = new MutationObserver(async (records: MutationRecord[]) => {
    const addedEvent = records.find((record: MutationRecord) => {
      const targetElm = record.target as HTMLElement;
      return targetElm.className === "modal-open";
    });

    if (addedEvent) {
      const modalElm = document.getElementsByClassName("modal-body");
      if (modalElm) {
        const modalBody = modalElm[0] as HTMLElement;
        const link = modalBody.firstChild as HTMLLinkElement;
        /*SVG以外の場合はここがnullでdrawButtonがつく*/
        if (link.href) {
          /*backGroundScriptにSVGリソースを取得させる*/
          const request = {
            tag: "getImg",
            body: {
              url: link.href
            }
          };
          chrome.runtime.sendMessage(request);
          chrome.runtime.onMessage.addListener(
            async (message, sender, sendResponse) => {
              if (message.tag === "insertSVG") {
                if (message.body) {
                  /*子要素のimgを削除する*/
                  link.removeChild(link.firstChild);
                  /*代わりにSVGを差し込む*/
                  link.insertAdjacentHTML("afterbegin", message.body);
                }
              }
            }
          );
        }
      }
    }
  });
  const observeOption = { childList: true };
  observer.observe(document.body, observeOption);

  const pageList = await getPagesWithImage();
  const imageMap: TitleImageMap[] = pageList.map(page => {
    return { title: page.title, image: page.image } as TitleImageMap;
  });
  console.dir(imageMap);

  const startDrawing = () => {
    /*reactDOMを追加する*/
    openCanvas(imageMap);
  };
  const stopDrawing = () => {
    /*reactDOMを削除する*/
    closeCanvas();
  };

  chrome.storage.onChanged.addListener(details => {
    if (Object.keys(details).includes("mode")) {
      if (details.mode.newValue === true) {
        startDrawing();
      } else if (details.mode.newValue === false) {
        stopDrawing();
      }
    }
  });
};
