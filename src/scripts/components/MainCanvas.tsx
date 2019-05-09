import * as React from "react";
import { useState, useRef, useEffect, FC } from "react";
import * as ReactDOM from "react-dom";
import { Points, getPoint } from "./utils";
import {
  addPath,
  updatePath,
  setPointerEventsEnableToAllPath,
  setPointerEventsDisableToAllPath
} from "./PathDrawer";
import { PenWidthSelector } from "./PenWidthSelector";
import { ColorPicker } from "./ColorPicker";
import { ModeSelector } from "./ModeSelector";
import { ImportPotal } from "./ImportPotal";

interface MainCanvasProps {
  vbLeft: number;
  vbTop: number;
  vbRight: number;
  vbBottom: number;
}

export const MainCanvas = (
  props: MainCanvasProps
): React.FC<{ MainCanvasProps }> => {
  // Declare a new state variable, which we'll call "count"
  const { vbLeft, vbTop, vbRight, vbBottom } = props;
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
    const canvas = svgCanvas.current;
    const point: Points = getPoint(event.pageX, event.pageY, canvas);
    lastPath = addPath(canvas, point);
    lastPath.setAttribute("stroke", color);
    lastPath.setAttribute("stroke-width", `${penWidth}`);
    lastPath.classList.add("current-path");
    console.dir(lastPath);
  };

  const handleMove = (event: React.SyntheticEvent<HTMLElement>) => {
    //event.persist();
    if (isDragging) {
      if (lastPath) {
        const canvas = svgCanvas.current;
        const point: Points = getPoint(event.pageX, event.pageY, canvas);
        updatePath(lastPath, point);
        console.dir(lastPath);
      } else {
        console.log("something went wrong");
      }
    }
  };

  const handleUp = (event: React.SyntheticEvent<HTMLElement>) => {
    //event.persist();
    isDragging = false;
    lastPath.classList.remove("current-path");
    lastPath = null;
  };

  return (
    <React.Fragment>
      <div className={"rootContainer"}>
        <div className={"toolBar"}>
          <PenWidthSelector widthChange={onWidthChange} />
          <ColorPicker colorChange={onColorChange} />
          <ModeSelector modeChange={onModeChange} />
          <ImportPotal modalSubmit={console.log} />

          <span>100%</span>
          <input
            type={"button"}
            value={"Upload"}
            className={"hicButton toolButton leftButton"}
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
