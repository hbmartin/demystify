import { HarRestful, NodeData } from "../types/index.js";
import { cloneDeep } from "lodash";
import { expect, it } from "vitest";
import restJsonPostAlt from "../__fixtures__/rest-post-alt.json" with { type: "json" };
import { mergeNodeData } from "./merge-node-data.js";
import { createNodeData } from "./create-node-data.js";
import { createHarEntry } from "../__helpers__/create-har-entry.js";

const mimeType = "application/json";
const method = "post";

it("sets mostRecentRequest and mostRecentResponse", () => {
  const harEntryOne = restJsonPostAlt.log.entries[0]! as HarRestful;
  const harEntryTwo = cloneDeep(restJsonPostAlt).log.entries[0]! as HarRestful;
  harEntryTwo.request.postData!.text = '{ "test": true }';
  const nodeDataOne = createNodeData({
    data: { har: harEntryOne, kind: "rest-json" },
  });
  const nodeDataTwo = createNodeData({
    data: { har: harEntryTwo, kind: "rest-json" },
  });
  const merged = mergeNodeData(nodeDataOne, nodeDataTwo);
  expect(
    merged.methods["POST"]?.["request"]!["application/json"]?.mostRecent
  ).toEqual({ test: true });
  expect(
    merged.methods["POST"]?.["response"]?.["200"]!["application/json"]
      ?.mostRecent
  ).toEqual({ test: 1 });
});

it("sets mostRecentPathname", () => {
  const harEntryOne = restJsonPostAlt.log.entries[0]! as HarRestful;
  const harEntryTwo = cloneDeep(restJsonPostAlt).log.entries[0]! as HarRestful;
  const nodeDataOne = createNodeData({
    data: { har: harEntryOne, kind: "rest-json" },
  });
  const nodeDataTwo = createNodeData({
    data: { har: harEntryTwo, kind: "rest-json" },
  });
  nodeDataOne.mostRecentPathname = 'one';
  nodeDataTwo.mostRecentPathname = 'two';
  const merged = mergeNodeData(nodeDataOne, nodeDataTwo);
  expect(
    merged.mostRecentPathname
  ).toBe("two");
});

it("merges request data", () => {
  const mimeType = "application/json";
  const harEntryOne = createHarEntry({
    request: { text: '{"a":{"b":1}}', mimeType },
  });
  const harEntryTwo = createHarEntry({
    request: { text: '{"a":{"c":1}}', mimeType },
  });
  const nodeDataOne = createNodeData({
    data: { har: harEntryOne, kind: "rest-json" },
  });
  const nodeDataTwo = createNodeData({
    data: { har: harEntryTwo, kind: "rest-json" },
  });
  const merged = mergeNodeData(nodeDataOne, nodeDataTwo);
  expect(merged.methods["POST"]?.["request"]![mimeType]!.body).toEqual({
    type: "object",
    properties: {
      a: {
        type: "object",
        properties: {
          b: {
            type: "integer",
          },
          c: {
            type: "integer",
          },
        },
      },
    },
    required: ["a"],
  });
});

it("merges response data", () => {
  const mimeType = "application/json";
  const harEntryOne = createHarEntry({
    response: { text: '{"a":{"b":1}}', mimeType },
  });
  const harEntryTwo = createHarEntry({
    response: { text: '{"a":{"c":1}}', mimeType },
  });
  const nodeDataOne = createNodeData({
    data: { har: harEntryOne, kind: "rest-json" },
  });
  const nodeDataTwo = createNodeData({
    data: { har: harEntryTwo, kind: "rest-json" },
  });
  const merged = mergeNodeData(nodeDataOne, nodeDataTwo);
  const statusCode = harEntryOne.response.status;
  expect(
    merged.methods["POST"]?.response[statusCode]?.[mimeType]?.body
  ).toEqual({
    type: "object",
    properties: {
      a: {
        type: "object",
        properties: {
          b: {
            type: "integer",
          },
          c: {
            type: "integer",
          },
        },
      },
    },
    required: ["a"],
  });
});

it("merges cookies", () => {
  const harEntryOne = createHarEntry({
    cookies: [
      { name: "access_token", value: "1" },
      { name: "one", value: "one" },
    ],
  });
  const harEntryTwo = createHarEntry({
    cookies: [
      { name: "access_token", value: "2" },
      { name: "two", value: "two" },
    ],
  });
  const nodeDataOne = createNodeData({
    data: { har: harEntryOne, kind: "rest-json" },
  });
  const nodeDataTwo = createNodeData({
    data: { har: harEntryTwo, kind: "rest-json" },
  });
  const merged = mergeNodeData(nodeDataOne, nodeDataTwo);
  expect(merged.methods["POST"]?.cookies).toEqual({
    access_token: "",
  });
});

it("handles empty response bodies", () => {
  const nodeDataOne: NodeData = {
    mostRecentPathname: "",
    protocol: "http:",
    methods: {
      [method]: {
        cookies: { access_token: "abc" },
        requestHeaders: [],
        response: {
          "304": {
            "application/json": {
              kind: "rest-json",
              mostRecent: null,
            },
          },
        },
        responseHeaders: ["x-amz-cf-id", "x-amz-cf-pop", "x-cache"],
      },
    },
  };
  const merged = mergeNodeData(nodeDataOne, nodeDataOne);
  expect(merged.methods[method]?.response["304"]?.[mimeType]).toEqual({
    kind: "rest-json",
    mostRecent: null,
    body: undefined,
  });
});

it("merges query parameters", () => {
  const harEntryOne = createHarEntry({
    cookies: [{ name: "access_token", value: "1" }],
  });
  const harEntryTwo = createHarEntry({
    cookies: [{ name: "access-token", value: "1" }],
  });
  harEntryOne.request.queryString = [{ name: "a", value: "1" }];
  harEntryTwo.request.queryString = [{ name: "b", value: "2" }];
  const nodeDataOne = createNodeData({
    data: { har: harEntryOne, kind: "rest-json" },
  });
  const nodeDataTwo = createNodeData({
    data: { har: harEntryTwo, kind: "rest-json" },
  });
  const merged = mergeNodeData(nodeDataOne, nodeDataTwo);
  expect(merged.methods["POST"]?.queryParameters).toEqual({
    a: "1",
    b: "2",
  });
});
