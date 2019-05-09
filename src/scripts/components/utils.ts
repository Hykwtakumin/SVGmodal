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
