//拡張機能自体をリロードするスクリプト
export const reloadExtension = () => {
  console.log(`Extension will be reload`);
  chrome.runtime.reload();
};
