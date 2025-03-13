import decodeUriComponent from "decode-uri-component";
import qs from "fast-querystring";
import { convertXML } from "simple-xml-to-json";
import { HarRestful, JSONType, NodeData } from "../types/index.js";
import {
  createSchemaElseUndefined,
  parseJSON,
  getAuthHeaders,
  filterIgnoreHeaders,
} from "../utils/index.js";
import { ValidHar } from "../har-to-hartype/index.js";
import { Schema } from "genson-js/dist/types.js";
import { Cookie } from "har-format";

const parseRequestBody = (harRequest: HarRestful): JSONType => {
  const { mimeType, text } = harRequest.request.postData || {};
  if (mimeType?.startsWith("application/x-www-form-urlencoded") && text)
    return qs.parse(text) as JSONType;
  if (mimeType?.startsWith("application/json")) return parseJSON(text);
  return null;
};

const parseResponseBody = (harResponse: HarRestful): JSONType => {
  const { mimeType, text } = harResponse.response.content;
  if (mimeType?.startsWith("application/json")) return parseJSON(text);
  return null;
};

const expectFilterToContain = ["token", "session"];
const filterCookies = (cookies: Cookie[]) => {
  return cookies.reduce((acc, { name }) => {
    if (expectFilterToContain.some(filter => name.toLowerCase().includes(filter))) {
      return { ...acc, [name]: '' };
    }
    return acc;
  }, {});
};

export const createNodeData = ({ data: { har, kind } }: { data: ValidHar }): NodeData => {
  // 0 - Parse request/response bodies in relation to mime type
  let requestBody: JSONType | undefined;
  let responseBody: JSONType | undefined;
  let requestBodySchema: Schema | undefined;
  let responseBodySchema: Schema | undefined;
  if (kind === "rest-xml") {
    requestBody = har.request.postData?.text;
    responseBody = har.response.content.text;
    requestBodySchema = requestBody
      ? createSchemaElseUndefined(convertXML(requestBody))
      : undefined;
    responseBodySchema = responseBody
      ? createSchemaElseUndefined(convertXML(responseBody))
      : undefined;
  } else {
    requestBody = parseRequestBody(har);
    responseBody = parseResponseBody(har);
    requestBodySchema = createSchemaElseUndefined(requestBody);
    responseBodySchema = createSchemaElseUndefined(responseBody);
  }
  // 1 - Define node data
  const requestHeaders = getAuthHeaders(har.request.headers);
  const responseHeaders = filterIgnoreHeaders(har.response.headers).map(({ name }) => name);
  const method = har.request.method;
  const pathname = decodeUriComponent(new URL(har.request.url).pathname);
  const requestMime = har.request.postData?.mimeType;
  const responseMime = har.response.content.mimeType;
  const statusCode = har.response.status.toString();
  const cookies = har.request.cookies;
  const protocol = new URL(har.request.url).protocol as "http:" | "https:";
  return {
    protocol,
    mostRecentPathname: pathname,
    methods: {
      [method]: {
        ...(cookies && cookies.length && { cookies: filterCookies(har.request.cookies) }),
        ...(requestMime && {
          request: {
            [requestMime]: {
              kind,
              body: requestBodySchema,
              mostRecent: requestBody,
            },
          },
        }),
        requestHeaders: requestHeaders,
        response: {
          [statusCode]: {
            [responseMime]: {
              kind,
              body: responseBodySchema,
              mostRecent: responseBody,
            },
          },
        },
        responseHeaders: responseHeaders,
        ...(har.request.queryString?.length && { queryParameters: har.request.queryString.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {}) }),
      },
    },
  };
};
