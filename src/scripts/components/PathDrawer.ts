import { Points, TitleImageMap } from "./utils";

export const addPath = (canvas: SVGElement, point: Points): SVGPathElement => {
  const pathElm: SVGPathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  const initialPoint = `M ${point.x} ${point.y} `;
  pathElm.setAttribute("d", initialPoint);
  pathElm.setAttribute("fill", "none");
  pathElm.setAttribute("pointer-events", "none");
  canvas.appendChild(pathElm);
  return pathElm;
};

export const updatePath = (path: SVGPathElement, point: Points) => {
  let pointsArray: string = path.getAttribute("d");
  const movement = ` L ${point.x} ${point.y}`;
  pointsArray += movement;
  path.setAttribute("d", pointsArray);
};

export const addLusterImage = (
  canvas: SVGElement,
  importMap: TitleImageMap
): SVGElement => {
  const ankerElm: SVGAElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "a"
  );

  ankerElm.setAttribute("xlink:href", `./${importMap.title}`);

  const foreign = document.createElementNS(
    "http://www.w3.org/1999/xhtml",
    "foreignObject"
  );
  foreign.setAttribute("width", "180");
  foreign.setAttribute("height", "180");

  const div = document.createElement("div");
  div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

  const img = document.createElement("img");
  img.src = importMap.image;
  div.appendChild(img);
  foreign.appendChild(div);

  ankerElm.appendChild(foreign);
  canvas.appendChild(ankerElm);
  return ankerElm;
};

export const setPointerEventsEnableToAllPath = (canvas: SVGElement) => {
  const allPathList = Array.from(canvas.querySelectorAll("path"));
  console.dir(allPathList);
  allPathList.forEach(path => {
    path.setAttribute("pointer-events", "auto");
  });
};

export const setPointerEventsDisableToAllPath = (canvas: SVGElement) => {
  const allPathList = Array.from(canvas.querySelectorAll("path"));
  console.dir(allPathList);
  allPathList.forEach(path => {
    path.setAttribute("pointer-events", "none");
  });
};
