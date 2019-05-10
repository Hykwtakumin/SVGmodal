export type Points = {
  x: number;
  y: number;
};

export const getPoint = (
  pageX: number,
  pageY: number,
  targetDomRect: SVGElement
): Points => {
  let x, y;
  let rect = targetDomRect.getBoundingClientRect();
  let dx = rect.left + window.pageXOffset;
  let dy = rect.top + window.pageYOffset;
  x = pageX - dx;
  y = pageY - dy;
  return { x, y };
};

export type TitleImageMap = {
  title: string;
  image: string;
};

export type EditorMode = "draw" | "edit";

export type OpeType =
  | "draw"
  | "remove"
  | "import"
  | "delete"
  | "move"
  | "transeform";

export type OpeStacks = {
  type: OpeType;
  desc: Object;
};

export const getBase64 = (src: string): Promise<string> => {
  /*backGroundScriptにbase64リソースを取得させる*/
  return new Promise((resolve, reject) => {
    const request = {
      tag: "getImg64",
      body: {
        url: src
      }
    };
    chrome.runtime.sendMessage(request);
    chrome.runtime.onMessage.addListener(
      async (message, sender, sendResponse) => {
        if (message.tag === "loadBase64" && message.body) {
          resolve(message.body);
        }
      }
    );
  });
};
