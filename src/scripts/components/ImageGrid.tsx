import * as React from "react";
import { TitleImageMap } from "./utils";

interface ImageGridProps {
  titleImageMap: TitleImageMap[];
  imageSelected: (selectedMap: TitleImageMap) => void;
}

export const ImageGrid = (props: ImageGridProps) => {
  const { titleImageMap, imageSelected } = props;

  console.dir(titleImageMap);

  //   const images = titleImageMap.map((item: TitleImageMap, index: number) => {
  //     <a key={index} href={`./${item.title}`}>
  //       <div key={index} className={"imageGridItemDiv"}>
  //         <img
  //           key={index}
  //           className={"imageGridItems"}
  //           alt={item.title}
  //           src={item.title}
  //           onClick={imageSelected}
  //         />
  //       </div>
  //     </a>;
  //   });
  const handleImageClick = (event: React.SyntheticEvent) => {
    console.log(`title:${event.target.title} image:${event.target.src}`);
    const selectedMap: TitleImageMap = {
      title: event.target.title,
      image: event.target.src
    };
    imageSelected(selectedMap);
  };

  return (
    <div className={"imageGridContainer"}>
      {titleImageMap.map((item: TitleImageMap, index: number) => {
        return (
          <div key={index} className={"imageGridItemDiv"}>
            <img
              key={index}
              className={"imageGridItems"}
              alt={item.title}
              title={item.title}
              src={item.image}
              onClick={handleImageClick}
            />
          </div>
        );
      })}
    </div>
  );
};
