import { HarEntry } from "../types/index.js";

type Content = {
  mimeType: string;
  text?: string;
};

type CreateHarEntry = (args?: {
  response?: Content;
  request?: Content;
  queryString?: { name: string; value: string }[];
  cookies?: { name: string; value: string }[];
  method?: string;
  url?: string;
}) => HarEntry;

export const createHarEntry: CreateHarEntry = (args = {}) => {
  return {
    cache: {},
    _resourceType: "xhr",
    request: {
      method: args.method || "POST",
      url: args.url || "https://www.example.com/v1/track",
      httpVersion: "http/2.0",
      headers: [],
      queryString: args.queryString || [],
      cookies: args.cookies || [],
      headersSize: -1,
      bodySize: 6798,
      postData: {
        mimeType: "application/json",
        text: '{ "test": "integer" }',
        ...args.request,
      },
    },
    response: {
      status: 200,
      statusText: "OK",
      httpVersion: "http/2.0",
      headers: [],
      cookies: [],
      content: {
        size: 28,
        mimeType: "application/json",
        text: '{ "test": 1 }',
        ...args.response,
      },
      redirectURL: "",
      headersSize: -1,
      bodySize: -1,
      _transferSize: 166,
    },
    serverIPAddress: "44.219.182.139",
    startedDateTime: "2023-10-15T07:42:54.694Z",
    time: 318.07399999186396,
    timings: {
      blocked: 1.4950000001639128,
      dns: 0.010000000000000009,
      ssl: 105.26800000000001,
      connect: 203.84,
      send: 0.21299999999999386,
      wait: 112.1749999562949,
      receive: 0.341000035405159,
    },
  };
};
