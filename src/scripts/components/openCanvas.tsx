import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainCanvas } from "./MainCanvas";
import { TitleImageMap } from "./utils";

/*Activeなタブにだけ表示するにはどうすれば良い?*/
/*dialog要素を表示してからReactDOMをrenderする*/
export const openCanvas = (imageMap: TitleImageMap[]) => {
  const rootDialog: HTMLDialogElement = document.createElement("dialog");
  rootDialog.id = "rootDialog";

  document.body.appendChild(rootDialog);
  rootDialog.showModal();
  const left = rootDialog.offsetLeft;
  const top = rootDialog.offsetTop;
  const right = rootDialog.offsetWidth;
  const bottom = rootDialog.offsetHeight;
  ReactDOM.render(
    <MainCanvas
      vbLeft={0}
      vbTop={0}
      vbRight={right}
      vbBottom={bottom}
      imageMap={imageMap}
    />,
    rootDialog
  );
};

export const closeCanvas = () => {
  const rootDialog = document.getElementById("rootDialog") as HTMLDialogElement;
  if (rootDialog) {
    rootDialog.close();
    rootDialog.remove();
  }
};
