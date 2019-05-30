import * as React from "react";
import { useState, useRef, useEffect, FC } from "react";
import * as ReactDOM from "react-dom";
import { Points, getPoint, TitleImageMap, getBase64 } from "./utils";
import {
  addPath,
  updatePath,
  addLusterImage,
  setPointerEventsEnableToAllPath,
  setPointerEventsDisableToAllPath
} from "./PathDrawer";
import { PenWidthSelector } from "./PenWidthSelector";
import { ColorPicker } from "./ColorPicker";
import { ModeSelector } from "./ModeSelector";
import { ImportPotal } from "./ImportPotal";
import * as moment from "moment";

interface MainCanvasProps {
  vbLeft: number;
  vbTop: number;
  vbRight: number;
  vbBottom: number;
  imageMap: TitleImageMap[];
}

export const MainCanvas = (
  props: MainCanvasProps
): React.FC<{ MainCanvasProps }> => {
  // Declare a new state variable, which we'll call "count"
  const { vbLeft, vbTop, vbRight, vbBottom, imageMap } = props;
  const [lastpath, setLastPath] = useState({ null: SVGElement });
  const [penWidth, setPenWidth] = useState(6);
  const [color, setColor] = useState("#585858");
  const [editorMode, setEditorMode] = useState("draw");
  // const [canvasSize, setCanvasSize] = useState({
  //   width: offSetWidth,
  //   height: offSetHeight
  // });

  let isDragging: boolean = false;
  let lastPath;
  let lastElm;
  const svgCanvas = useRef(null);

  /*on Canvas Resize*/
  /*拡張においてひとまずリサイズは考えない */
  // window.onresize = () => {
  //   setCanvasSize({
  //     width: window.innerWidth,
  //     height: window.innerHeight * 0.6
  //   });
  // };

  const onWidthChange = (event: React.SyntheticEvent<HTMLSelectElement>) => {
    console.log(`Penwidth changes! : ${event.target.value}`);
    setPenWidth(parseInt(event.target.value));
  };

  const onColorChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    console.log(`Color changes! : ${event.target.value}`);
    setColor(event.target.value);
  };

  const onModeChange = (event: React.SyntheticEvent<HTMLSelectElement>) => {
    console.log(`EditorMode changes! : ${event.target.value}`);
    setEditorMode(event.target.value);
  };

  const handleDown = (event: React.SyntheticEvent<HTMLElement>) => {
    event.persist();
    isDragging = true;
    if (editorMode === "draw") {
      const canvas = svgCanvas.current;
      const point: Points = getPoint(event.pageX, event.pageY, canvas);
      lastPath = addPath(canvas, point);
      lastPath.setAttribute("stroke", color);
      lastPath.setAttribute("stroke-width", `${penWidth}`);
      lastPath.classList.add("current-path");
    } else if (editorMode === "edit") {
      console.dir(event.target);
      lastElm = event.target;
    }
  };

  const handleMove = (event: React.SyntheticEvent<HTMLElement>) => {
    //event.persist();
    if (isDragging) {
      if (editorMode === "draw") {
        if (lastPath) {
          const canvas = svgCanvas.current;
          const point: Points = getPoint(event.pageX, event.pageY, canvas);
          updatePath(lastPath, point);
        } else {
          console.log("something went wrong");
        }
      } else if (editorMode === "edit") {
        if (lastElm) {
          const canvas = svgCanvas.current;
          const point: Points = getPoint(event.pageX, event.pageY, canvas);
          //lastElm.setAttributeNS(null, "x", point.x.toString());
          //lastElm.setAttributeNS(null, "y", point.y.toString());
          lastElm.setAttribute("x", `${point.x}`);
          lastElm.setAttribute("y", `${point.y}`);
        } else {
          console.log("something went wrong");
        }
      }
    }
  };

  const handleUp = (event: React.SyntheticEvent<HTMLElement>) => {
    //event.persist();
    isDragging = false;
    if (editorMode === "draw") {
      lastPath.classList.remove("current-path");
      lastPath = null;
    } else if (editorMode === "edit") {
    }
  };

  const handleImportImage = async (importMap: TitleImageMap) => {
    setEditorMode("edit");
    const canvas = svgCanvas.current;
    //const image = await getBase64(importMap.image);
    const importedImage = addLusterImage(canvas, importMap);
    //console.dir(importedImage);
  };

  const download = () => {
    const now = moment().format("YYYY-MM-DD-HH-mm-ss");
    const fileName = `hyperillust_${now}_.svg`;
    const blobObject: Blob = new Blob(
      [new XMLSerializer().serializeToString(svgCanvas.current)],
      { type: "image/svg+xml;charset=utf-8" }
    );
    const dlUrl = window.URL.createObjectURL(blobObject);
    const dlLink = document.createElement("a");
    document.body.appendChild(dlLink);
    dlLink.setAttribute("href", dlUrl);
    dlLink.setAttribute("target", "_blank");
    dlLink.setAttribute("download", fileName);
    dlLink.click();
  };

  const handleUpload = () => {
    console.log("upload button clicked!");
    const now = moment().format("YYYY-MM-DD-HH-mm-ss");
    const fileName = `hyperillust_${now}_.svg`;
    const blobObject: Blob = new Blob(
      [new XMLSerializer().serializeToString(svgCanvas.current)],
      { type: "image/svg+xml;charset=utf-8" }
    );
    console.dir(blobObject);
    const request = {
      tag: "upload",
      body: blobObject,
      name: fileName
    };
    chrome.runtime.sendMessage(request);
    chrome.runtime.onMessage.addListener(
      async (message, sender, sendResponse) => {
        if (message.tag === "uploaded") {
          alert("アップロードに成功しました!");
        }
      }
    );
  };

  return (
    <React.Fragment>
      <div className={"rootContainer"}>
        <div className={"toolBar"}>
          <PenWidthSelector widthChange={onWidthChange} />
          <ColorPicker colorChange={onColorChange} />
          <ModeSelector modeChange={onModeChange} />
          <ImportPotal
            modalSubmit={console.log}
            imageMap={imageMap}
            importImage={handleImportImage}
          />

          <span>100%</span>
          <input
            type={"button"}
            value={"DL"}
            className={"hicButton toolButton"}
            onPointerDown={download}
          />
          <input
            type={"button"}
            value={"Upload"}
            className={"hicButton toolButton leftButton"}
            onPointerDown={handleUpload}
          />
        </div>

        <div
          className={"drawSection"}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
        >
          <svg
            ref={svgCanvas}
            className={"svgCanvas"}
            viewBox={`${vbLeft} ${vbTop} ${vbRight} ${vbBottom}`}
            width={`${vbRight}`}
            height={`${vbBottom}`}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <rect width="100%" height="100%" fill="#FFFFFF" />
            <defs>
              <style type={"text/css"}>{`<![CDATA[ 
            
           ]]>`}</style>
            </defs>
          </svg>
        </div>
      </div>
    </React.Fragment>
  );
};
