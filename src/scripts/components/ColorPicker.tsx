import * as React from "react";
import { useState, useRef, useEffect, FC } from "react";
interface ColorPickerProps {
  colorChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}

/*ペンの太さを変更するコンポーネント*/
/* TODO SVGにした方が良いかも,selectはかっこよくない */
export const ColorPicker = (props: ColorPickerProps) => {
  const { colorChange } = props;
  return (
    <React.Fragment>
      <input
        type={"color"}
        defaultValue={"#585858"}
        className={"button toolButton"}
        onChange={colorChange}
      />
    </React.Fragment>
  );
};
