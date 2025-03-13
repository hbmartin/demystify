import { Schema } from "genson-js/dist/types.js";
import { NodeData } from "../types/index.js";

type Params = {
  pathname: string;
  protocol: 'http:';
  method: string;
  reqBody: Schema;
  reqMediaType: string;
  resMediaType: string;
  resBody: Schema;
  resStatusCode: number;
};

const defaultParams: Params = {
  pathname: '',
  protocol: 'http:',
  method: 'GET',
  reqMediaType: 'application/json',
  resMediaType: 'application/json',
  resStatusCode: 200,
  reqBody: {},
  resBody: {},
};

export const createNodeData = (args: Partial<Params> = {}): NodeData => {
  const data = { ...defaultParams, ...args }
  return {
    mostRecentPathname: data.pathname,
    protocol: data.protocol,
    methods: {
      [data.method]: {
        request: {
          [data.reqMediaType]: {
            body: data.reqBody,
          },
        },
        response: {
          [data.resStatusCode]: {
            [data.resMediaType]: {
              body: data.resBody,
            },
          },
        },
      }
    }
  }
};
