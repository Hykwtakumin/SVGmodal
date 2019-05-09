import * as React from "react";
import { useState, useRef, useEffect, FC } from "react";
interface PenWidthSelectorProps {
  widthChange: (e: React.SyntheticEvent<HTMLSelectElement>) => void;
}

/*ペンの太さを変更するコンポーネント*/
/* TODO SVGにした方が良いかも,selectはかっこよくない */
export const PenWidthSelector = (props: PenWidthSelectorProps) => {
  const { widthChange } = props;
  return (
    <React.Fragment>
      <select
        className={"toolSelectMenu"}
        onChange={widthChange}
        defaultValue={"6"}
      >
        <option value={"12"}>太</option>
        <option value={"6"}>中</option>
        <option value={"3"}>細</option>
      </select>
    </React.Fragment>
  );
};
