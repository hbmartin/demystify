import type { Schema } from "genson-js";
import { Kind } from "../har-to-hartype/index.js";

type BodyKind = Kind;

export type NodeData = {
  // The most recent pathname of this endpoint
  // This is used in conjunction with the dynamic pathname implicit in the graph
  // And lets us determine what both names and values are for path parameters
  mostRecentPathname: string;
  // The protocol of the request
  protocol: 'http:' | 'https:';
  // Methods such as GET, POST and schema values for requests
  methods: {
    [method: string]: {
      // cookies is a mapping of names to most recent values
      cookies?: { [name: string]: string };
      // Requests may not contain a body
      request?: {
        // mediaType is a a mime type such as application/json
        [mediaType: string]: {
          kind?: BodyKind;
          body?: Schema;
          // Sample of the most recent request
          mostRecent?: unknown;
        };
      };
      requestHeaders?: string[];
      response: {
        [statusCode: string]: {
          [mediaType: string]: {
            kind?: BodyKind;
            body?: Schema;
            // Sample of the most recent response
            mostRecent?: unknown;
          };
        };
      };
      responseHeaders?: string[];
      // queryParameters is a mapping of names to most recent values
      queryParameters?: { [name: string]: string };
    };
  };
};
