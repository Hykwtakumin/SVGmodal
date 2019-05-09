import * as React from "react";
import { useState, useRef, useEffect, FC } from "react";
import { getPagesWithImage } from "./UseScrapbox";
import { ImageGrid } from "./ImageGrid";
import { TitleImageMap } from "./utils";

interface ImportPotalProps {
  modalSubmit: (imageURL: string) => void;
  importImage: (importMap: TitleImageMap) => void;
  imageMap: TitleImageMap[];
}

/*画像をインポートする*/
export const ImportPotal = (props: ImportPotalProps) => {
  const { modalSubmit, imageMap, importImage } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [imagePagesList, setImagePagesList] = useState(imageMap);
  const modal = useRef(null);

  const showModal = () => {
    modal.current.showModal();
  };
  const closeModal = () => {
    modal.current.close();
  };

  const onInputChange = (event: React.SyntheticEvent) => {
    /*入力されたキーワードに一致する記事だけ絞りこんでいく*/
    if (event.target.value.length > 0) {
      const query: string = event.target.value;
      console.dir(query);
      const filteredList = imageMap.filter(item => item.title.includes(query));
      setImagePagesList(filteredList);
    } else {
      setImagePagesList(imageMap);
    }
  };

  const onImageSelected = (selectedMap: TitleImageMap) => {
    //alert(`selected page : ${map.title}`);
    /*SVGのキャンバスに選択された画像を追加 */
    importImage(selectedMap);
    /*editorModeをeditにする */
    /*モーダルを閉じる */
    closeModal();
  };

  return (
    <React.Fragment>
      <input
        type={"button"}
        value={"Import"}
        className={"hicButton toolButton"}
        onClick={showModal}
      />
      <dialog ref={modal} className={"importDialog"}>
        <h3>画像をインポートする</h3>
        <p>インポートしたい画像のURLまたはページ名を入力してください</p>
        <input
          type={"text"}
          onChange={onInputChange}
          className={"modalTextArea"}
        />
        <div className={"modalImageList"}>
          <ImageGrid
            titleImageMap={imagePagesList}
            imageSelected={onImageSelected}
          />
        </div>
        <div className={"modalButtons"}>
          <input
            type={"button"}
            value={"キャンセル"}
            className={"hicButton"}
            onClick={closeModal}
          />
          <input
            type={"button"}
            value={"インポート"}
            className={"hicButton"}
            onClick={closeModal}
          />
        </div>
      </dialog>
    </React.Fragment>
  );
};
