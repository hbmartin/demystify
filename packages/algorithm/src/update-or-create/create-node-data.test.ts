import { describe, expect, it } from "vitest";
import { createNodeData } from "./create-node-data.js";
import { HarEntry } from "../types/ir-graph.js";

describe("createNodeData", () => {
  it("should create node data for REST JSON request", () => {
    const har = {
      request: {
        method: "POST",
        url: "https://api.example.com/users",
        headers: [{ name: "Content-Type", value: "application/json" }],
        queryString: [{ name: "page", value: "1" }],
        postData: {
          mimeType: "application/json",
          text: '{"name":"test"}',
        },
      },
      response: {
        status: 200,
        headers: [{ name: "Content-Type", value: "application/json" }],
        content: {
          mimeType: "application/json",
          text: '{"id":1,"name":"test"}',
        },
      },
    } as unknown as HarEntry;

    const result = createNodeData({ data: { har, kind: "rest-json" } });

    expect(result).toEqual({
      protocol: "https:",
      mostRecentPathname: "/users",
      methods: {
        POST: {
          request: {
            "application/json": {
              kind: "rest-json",
              body: {
                required: ["name"],
                type: "object",
                properties: { name: { type: "string" } },
              },
              mostRecent: { name: "test" },
            },
          },
          requestHeaders: [],
          response: {
            "200": {
              "application/json": {
                kind: "rest-json",
                body: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                  },
                  required: ["id", "name"],
                },
                mostRecent: { id: 1, name: "test" },
              },
            },
          },
          responseHeaders: [],
          queryParameters: { page: "1" },
        },
      },
    });
  });

  it("should create node data for REST XML request", () => {
    const har = {
      request: {
        method: "POST",
        url: "https://api.example.com/items",
        headers: [{ name: "Content-Type", value: "application/xml" }],
        queryString: [],
        postData: {
          mimeType: "application/xml",
          text: "<item><name>test</name></item>",
        },
      },
      response: {
        status: 201,
        headers: [{ name: "Content-Type", value: "application/xml" }],
        content: {
          mimeType: "application/xml",
          text: "<response><item><id>1</id><name>test</name></item></response>",
        },
      },
    } as unknown as HarEntry;

    const result = createNodeData({ data: { har, kind: "rest-xml" } });

    expect(result.mostRecentPathname).toBe("/items");
    const post = result.methods.POST!;
    expect(post.request!["application/xml"]?.kind).toBe("rest-xml");
    expect(post.response["201"]!["application/xml"]?.kind).toBe("rest-xml");
  });

  it("should add cookies when specified", () => {
    const har = {
      request: {
        method: "POST",
        url: "https://api.example.com/users",
        headers: [{ name: "Content-Type", value: "application/json" }],
        queryString: [],
        cookies: [
          { name: "sessionid", value: "123" },
          { name: "access_token", value: "123" },
          { name: "refreshToken", value: "123" },
          { name: "somethingelse", value: "123" },
        ],
        postData: {
          mimeType: "application/json",
        },
      },
      response: {
        status: 200,
        headers: [{ name: "Content-Type", value: "application/json" }],
        content: {
          mimeType: "application/xml",
          text: "",
        },
      },
    } as unknown as HarEntry;

    const result = createNodeData({ data: { har, kind: "rest-json" } });

    expect(result.methods["POST"]?.cookies).toEqual({
      "access_token": "",
      "refreshToken": "",
      "sessionid": "",
    });
  });
});
