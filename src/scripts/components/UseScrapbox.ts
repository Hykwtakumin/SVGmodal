export const getProjectName = (): string => {
  const projectName = window.location.pathname.split("/")[1];
  return projectName;
};

export const getFullProjectPath = (): string => {
  return `${window.location.origin}/${window.location.pathname.split("/")[1]}/`;
};

export const getPagesWithImage = (): Promise<any[]> => {
  return new Promise<any[]>(async (resolve, reject) => {
    const request = await fetch(
      `https://scrapbox.io/api/pages/${getProjectName()}/`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-cache"
      }
    );
    let project = await request.json();
    /*まずproject全体のページ数を取得する*/
    const pages: number = project.count;
    console.log(`pages : ${pages}`);

    if (pages > 100) {
      /*ページ数が100以上の場合limitを指定した上で再度フェッチする*/
      const requestWithLimit = await fetch(
        `https://scrapbox.io/api/pages/${getProjectName()}/?limit=${pages}`,
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
      resolve(projectWithImages);
    }
  });
};
