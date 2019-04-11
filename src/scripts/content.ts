
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
                const img = link.firstChild as HTMLImageElement;


                console.dir(link.href);

                /*SVG以外の場合はここがnullでdrawButtonがつく*/
                if (link.href) {
                    /*子要素のimgを削除する*/
                    link.removeChild(link.firstChild);
                    /*代わりにSVGを差し込む*/
                    const request = {
                        tag: "getImg",
                        body: {
                            url: link.href
                        }
                    };
                    chrome.runtime.sendMessage(request);

                    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
                        console.dir(message);
                        if (message.tag === "insertSVG") {
                            link.insertAdjacentHTML("afterbegin", message.body);
                        }
                    });
                }


                console.dir(img);
            }

        }
    });
    const observeOption = {childList: true};
    observer.observe(document.body, observeOption);
};