import {
  ContentObject,
  HeaderObject,
  HeadersObject,
  MediaTypeObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
  ResponsesObject,
} from "openapi3-ts/oas31";
import { Endpoint } from "./yield-endpoints.js";
import { NodeData } from "../types/index.js";
import { isPartDynamic } from "../parameterisation/operations.js";

export const shouldIncludeRequestBody = (method: string) => {
  return !new Set(["GET", "DELETE", "HEAD"]).has(method);
};

type RequestParam = Endpoint["node"]["data"]["methods"]["get"]["request"];
export const createRequestBodyObject = (request: RequestParam) => {
  if (!request) return;
  const contentObject: ContentObject = {};
  Object.entries(request).forEach(([mediaType, data]) => {
    const mediaTypeObject: MediaTypeObject = {
      schema: data.body,
      example: data.mostRecent,
    };
    contentObject[mediaType] = mediaTypeObject;
  });
  const requestBodyObject: RequestBodyObject = {
    content: contentObject,
  };
  return requestBodyObject;
};

type ResponseParam = Endpoint["node"]["data"]["methods"]["get"]["response"];
export const createResponsesObject = (
  responseObject: ResponseParam,
  headers: string[],
) => {
  // Create response headers
  const headersObject: HeadersObject = {};

  if (headers) {
    for (const header of headers) {
      const headerObj: HeaderObject = {
        required: false,
        schema: {
          type: "string",
        },
      };
      headersObject[header] = headerObj;
    }
  }

  // Initialise responses object, set response objects from status codes
  const responsesObject: ResponsesObject = {};
  Object.entries(responseObject).forEach(([statusCode, mediaTypeObj]) => {
    Object.entries(mediaTypeObj).forEach(([mediaType, data]) => {
      const contentObject: ContentObject = {};
      const mediaTypeObject: MediaTypeObject = {
        schema: data.body,
        example: data.mostRecent,
      };
      contentObject[mediaType] = mediaTypeObject;
      const responseObject: ResponseObject = {
        content: contentObject,
        description: "",
        headers: headersObject,
      };
      responsesObject[statusCode] = responseObject;
    });
  });

  return responsesObject;
};

export const createQueryParameterObjects = (
  queryParameters: NodeData["methods"]["get"]["queryParameters"],
): Array<ParameterObject> => {
  if (!queryParameters || !Object.keys(queryParameters).length) return [];
  return Object.entries(queryParameters).map(([name, example]) => {
    const parameterObject: ParameterObject = {
      name,
      in: "query",
      example,
      required: true,
      schema: {
        type: "string",
      },
    };
    return parameterObject;
  });
};

export const createCookieParameterObjects = (
  cookies: NodeData["methods"]["get"]["cookies"],
): Array<ParameterObject> => {
  return cookies && Object.entries(cookies).map(([name/*, example*/]) => ({
    name,
    required: true,
    in: "cookie",
    schema: {
      type: "string",
    },
  })) || [];
};

/**
 * A path may be parameterised, such as /a/b/{}/d
 * In which case, pathnames such as /a/b/<anything>/d will match
 * So there are two pathnames, the one that may be parameterised,
 *  and an actual pathname of a recent request
 *  that matched the parameterised name
 */
export const createPathParameterObjects = (
  parameterisedPathname: string[],
  actualPathname: string[],
): Array<ParameterObject> => {
  const parameters: ParameterObject[] = [];
  const minLen = Math.min(parameterisedPathname.length, actualPathname.length);
  for (let i = 0; i < minLen; i++) {
    const paramName = parameterisedPathname[i]!;
    const actualName = actualPathname[i]!;
    if (isPartDynamic(paramName)) {
      parameters.push({
        name: paramName.replace(/[{}]/g, ''),
        in: "path",
        schema: {
          type: "string",
        },
        // Important to keep it required for compatability with Scalar's API client
        required: true,
        example: actualName,
      });
    }
  }
  return parameters;
};
