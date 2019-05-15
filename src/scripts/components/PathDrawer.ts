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
): SVGForeignObjectElement => {
  const ankerElm: SVGAElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "a"
  );

  ankerElm.setAttribute("xlink:href", `./${importMap.title}`);
  ankerElm.setAttribute("target", "_blank");

  const imgElm = document.createElement("img");
  imgElm.src = importMap.image;

  const foreign = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "foreignObject"
  );
  foreign.setAttribute("width", `${imgElm.width}`);
  foreign.setAttribute("height", `${imgElm.height}`);
  foreign.style.backgroundImage = `url(` + importMap.image + `)`;
  //foreign.innerText = "this is foreign Object";

  // foreign.addEventListener("click", () => {
  //   alert("foreign object is clicked!");
  // });

  imgElm.remove();

  // const div = document.createElement("div");
  // div.setAttributeNS(null, "xmlns", "http://www.w3.org/1999/xhtml");

  // const svgImg = document.createElementNS(
  //   "http://www.w3.org/2000/svg",
  //   "image"
  // );
  // svgImg.setAttribute("x", "0");
  // svgImg.setAttribute("y", "0");
  // svgImg.setAttribute("width", "250");
  // svgImg.setAttribute("height", "250");
  // svgImg.setAttribute(
  //   "xlink:href",
  //   "https://i.gyazo.com/74e7862bd1d8ad608b059d1c44f3b08f.png"
  // );

  // const img = document.createElement("img");
  // img.src = importMap.image;
  // div.appendChild(img);
  //foreign.appendChild(div);

  //foreign.appendChild(svgImg);

  ankerElm.appendChild(foreign);
  canvas.appendChild(ankerElm);
  //canvas.appendChild(foreign);
  return foreign;
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
