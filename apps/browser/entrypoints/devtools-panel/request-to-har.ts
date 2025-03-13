import { HarEntry } from "demystify-lib";

type DevToolsRequest = chrome.devtools.network.Request;

export const requestToHar = async (devToolsReq: DevToolsRequest): Promise<HarEntry> => new Promise((resolve) => {
  devToolsReq.getContent((content, encoding) => {
    devToolsReq.response.content.text = content;
    devToolsReq.response.content.encoding = encoding;
    // @ts-expect-error
    delete devToolsReq.getContent
    resolve(devToolsReq);
  });
});
