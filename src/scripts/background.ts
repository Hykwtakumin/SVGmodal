import chromep from "chrome-promise";
import Tab = chrome.tabs.Tab;
import { reloadExtension } from "./components/reloadExtension";
import * as AWS from "aws-sdk";
import {
  ObjectKey,
  Body,
  ObjectCannedACL,
  PutObjectRequest
} from "aws-sdk/clients/s3";

console.log("this is background");
let isDrawingMode: boolean = false;

chrome.runtime.onInstalled.addListener(async details => {
  //await notifiCate("拡張機能がインストールされました!").catch((error) => {console.log(error)});
  chrome.browserAction.enable();
  //モードの初期値を設定
  await chromep.storage.local.set({ mode: false }).catch(e => console.log(e));
  await stopDrawing();
});

const startDrawing = async () => {
  await chromep.storage.local.set({ mode: true }).catch(e => console.log(e));
  chrome.browserAction.setBadgeText({ text: "ON" });
};

const stopDrawing = async () => {
  await chromep.storage.local.set({ mode: false }).catch(e => console.log(e));
  chrome.browserAction.setBadgeText({ text: "" });
};

const upLoad2s3 = (data: any, fileName: string): Promise<boolean> => {
  const albumBucketName = "";
  const bucketRegion = "";
  const IdentityPoolId = "";

  AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId
    })
  });

  const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: albumBucketName }
  });

  const fileKey: ObjectKey = `${encodeURIComponent(
    "HyperIllustCreator"
  )}/${fileName}`;

  const dataBody: Body = data;

  const opiton: ObjectCannedACL = "public-read";

  const reqObject = {
    Key: fileKey,
    Body: dataBody,
    ContentType: "image/svg+xml",
    ACL: opiton
  } as PutObjectRequest;

  return new Promise<boolean>((resolve, reject) => {
    s3.upload(reqObject, (err, data) => {
      if (err) {
        console.dir(err);
        resolve(false);
      }
      if (data) {
        resolve(true);
        console.dir(data);
      }
    });
  });
};

//拡張機能のボタンを押すとお絵かきモードが起動
chrome.browserAction.onClicked.addListener(tab => {
  if (
    chrome.runtime.lastError &&
    chrome.runtime.lastError.message.match(/cannot be scripted/)
  ) {
    window.alert("It is not allowed to use this extension in this page.");
    chrome.browserAction.disable();
    reloadExtension();
  }

  if (isDrawingMode != true) {
    startDrawing();
  } else {
    stopDrawing();
  }
  isDrawingMode = !isDrawingMode;
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const msg = message;
  if (msg.tag === "getImg") {
    const request = await fetch(msg.body.url as string, {
      method: "GET",
      mode: "cors"
    });
    const svg = await request.text();
    const response = {
      tag: "insertSVG",
      body: svg
    };
    const activeTab = (await chromep.tabs.query({ active: true })) as Tab[];
    const targetId = activeTab[0].id;
    chrome.tabs.sendMessage(targetId, response);
  } else if (msg.tag === "getImg64") {
    /*取得後Base64にして返却*/
    const request = await fetch(msg.body.url as string, {
      method: "GET",
      mode: "cors"
    });
    const image = await request.blob();
    const fileReader = new FileReader();
    fileReader.onload = async function() {
      const dataURI = this.result;
      const response = {
        tag: "loadBase64",
        body: dataURI
      };
      const activeTab = (await chromep.tabs.query({ active: true })) as Tab[];
      const targetId = activeTab[0].id;
      chrome.tabs.sendMessage(targetId, response);
    };
    fileReader.readAsDataURL(image);
  } else if (msg.tag === "upload2s3") {
    const result = await upLoad2s3(msg.body, msg.name);
    console.dir(result);
  }
});
