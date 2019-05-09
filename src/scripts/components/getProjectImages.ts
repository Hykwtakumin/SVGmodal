export const getProjectImages = async () => {
  /*リソースを取得する実験*/
  /*まずproject全体のページ数を取得する*/
  const request = await fetch("https://scrapbox.io/api/pages/takumin-draft/", {
    method: "GET",
    credentials: "include",
    cache: "no-cache"
  });
  let project = await request.json();
  /*まずproject全体のページ数を取得する*/
  const pages: number = project.count;
  console.log(`pages : ${pages}`);

  if (pages > 100) {
    /*ページ数が100以上の場合limitを指定した上で再度フェッチする*/
    const requestWithLimit = await fetch(
      `https://scrapbox.io/api/pages/takumin-draft/?limit=${pages}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-cache"
      }
    );
    project = await requestWithLimit.json();
    console.dir(project);
  }
  /*その中でも画像を含むものだけを抜き出す*/
  const projectWithImages = project.pages.filter(page => page.image !== null);
  console.dir(projectWithImages);

  if (projectWithImages && projectWithImages.length > 0) {
    projectWithImages.forEach(page => {
      //画像をひたすら読み込んで貼るテスト
      const icon: HTMLImageElement = document.createElement("img");
      icon.style.width = `100px`;
      icon.style.height = `100px`;
      const url = page.image;
      icon.src = url;
      document.body.appendChild(icon);
    });
  }
};
