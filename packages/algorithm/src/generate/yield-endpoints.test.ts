import { it, expect } from "vitest";
import { yieldEndpoints } from "./yield-endpoints.js";
import { NodeData } from "../types/index.js";
import { createNode } from "../utils/index.js";

const createDummyNode = (): NodeData =>({
  mostRecentPathname: "",
  methods: {
    "": {
      response: {}
    }
  },
  protocol: "http:"
});

it("should return an array with length equal to the number of nodes with values", () => {
  const dummyData = createDummyNode();
  const rootNode = createNode({ data: dummyData, key: "example.com" });
  const methodNode = (rootNode.childrenStatic = {
    post: createNode({ data: dummyData, key: "post", parent: rootNode }),
    get: createNode({ data: dummyData, key: "get", parent: rootNode }),
  });
  methodNode.post.childrenStatic = {
    api: createNode({ data: dummyData, key: "api", parent: methodNode.post }),
    cat: createNode({ data: dummyData, key: "cat", parent: methodNode.post }),
  };
  const endpoints = [...yieldEndpoints([rootNode])];
  expect(endpoints).toHaveLength(5);
});

it("when some nodes do not have a value, they are not counted", () => {
  const dummyData = createDummyNode();
  const rootNode = createNode({ data: dummyData, key: "example.com" });
  const methodNode = (rootNode.childrenStatic = {
    post: createNode({ data: dummyData, key: "post", parent: rootNode }),
    get: createNode({ key: "get", parent: rootNode }),
  });
  methodNode.post.childrenStatic = {
    api: createNode({ data: dummyData, key: "api", parent: methodNode.post }),
    cat: createNode({ key: "cat", parent: methodNode.post }),
  };
  const endpoints = [...yieldEndpoints([rootNode])];
  expect(endpoints).toHaveLength(3);
});
