window.onload = () => {
    const observer = new MutationObserver(async (records: MutationRecord[]) => {
        const addedEvent = records.find((record: MutationRecord) => {
            const targetElm = record.target as HTMLElement;
            return targetElm.className === "modal-open"
        });

        if (addedEvent) {
            const modalElm = document.getElementsByClassName("modal-body");
            if (modalElm) {
                const modalBody = modalElm[0] as HTMLElement;
                const link = modalBody.firstChild as HTMLLinkElement;
                /*SVG以外の場合はここがnullでdrawButtonがつく*/
                if (link.href) {
                    /*backGroundScriptにSVGリソースを取得させる*/
                    const request = {
                        tag: "getImg",
                        body: {
                            url: link.href
                        }
                    };
                    chrome.runtime.sendMessage(request);
                    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
                        if (message.tag === "insertSVG") {
                            if (message.body) {
                                /*子要素のimgを削除する*/
                                link.removeChild(link.firstChild);
                                /*代わりにSVGを差し込む*/
                                link.insertAdjacentHTML("afterbegin", message.body);
                            }
                        }
                    });
                }
            }

        }
    });
    const observeOption = {childList: true};
    observer.observe(document.body, observeOption);
};