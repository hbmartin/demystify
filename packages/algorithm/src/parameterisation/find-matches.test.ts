import { it, expect, describe } from "vitest";
import { findAllMatches } from "./find-matches.js";
import { createNode } from "../utils/index.js";
import { createNodeData } from "../__helpers__/index.js";

describe("findAllMatches", () => {
  it("should not match on non-200 status codes", () => {
    const nodeData = createNodeData();
    const insertedNode = createNode({ key: "new", data: nodeData });
    const n1 = createNode({ key: "n1", data: createNodeData({ resStatusCode: 300 }) });
    const n2 = createNode({ key: "n2", data: createNodeData({ resStatusCode: 400 }) });
    const root = createNode({ key: "", childrenStatic: { n1, n2 }, data: nodeData });
    const matches = findAllMatches(["users"], insertedNode, root);
    expect(matches).toHaveLength(0);
  });

  it("should match single node (/part)", () => {
    const nodeData = createNodeData();
    const insertedNode = createNode({ key: "new", data: nodeData });
    const n1 = createNode({ key: "n1", data: nodeData });
    const n2 = createNode({ key: "n2", data: nodeData });
    const root = createNode({ key: "", childrenStatic: { n1, n2 }, data: nodeData });
    const matches = findAllMatches(["users"], insertedNode, root);
    expect(matches).toHaveLength(2);
  });

  it("should match single node (/part) among competing options", () => {
    const nodeData = createNodeData({ resBody: { required: ["one"] } });
    const otherNodeData = createNodeData({ resBody: { required: ["two"] } });
    const insertedNode = createNode({ key: "new", data: nodeData });
    const n1 = createNode({ key: "n1", data: nodeData });
    const n2 = createNode({ key: "n2", data: nodeData });
    const n3 = createNode({ key: "n3", data: otherNodeData });
    const n4 = createNode({ key: "n4", data: otherNodeData });
    const root = createNode({ key: "", childrenStatic: { n1, n2, n3, n4 }, data: nodeData });
    const matches = findAllMatches(["users"], insertedNode, root);
    expect(matches).toHaveLength(2);
  });

  it("should not match on non-200 status codes for a longer path", () => {
    const insertedNode = createNode({ key: "new", data: createNodeData() });
    const n1 = createNode({ key: "n1", data: createNodeData({ resStatusCode: 300 }) });
    const n2 = createNode({ key: "n2", data: createNodeData({ resStatusCode: 300 }) });
    const n3 = createNode({ key: "n3", data: createNodeData({ resStatusCode: 400 }) });
    const n4 = createNode({ key: "n4", data: createNodeData({ resStatusCode: 300 }) });
    const n5 = createNode({ key: "n5", data: createNodeData({ resStatusCode: 300 }) });
    const n6 = createNode({ key: "n6", data: createNodeData({ resStatusCode: 300 }) });
    n1.childrenStatic["n3"] = n3;
    n3.childrenStatic["n4"] = n4;
    n2.childrenStatic["n5"] = n5;
    n1.childrenStatic["n6"] = n6;
    const root = createNode({ key: "", childrenStatic: { n1, n2 }, data: createNodeData() });
    const matches = findAllMatches(["users"], insertedNode, root);
    expect(matches).toHaveLength(0);
  });

  it("should match in the middle of a path", () => {
    const nodeData = createNodeData();
    const insertedNode = createNode({ key: "new", data: nodeData });
    const n1 = createNode({ key: "n1", data: createNodeData({ resStatusCode: 300 }) });
    const n2 = createNode({ key: "n2", data: createNodeData({ resStatusCode: 300 }) });
    const n3 = createNode({ key: "n3", data: nodeData });
    const n4 = createNode({ key: "n4", data: createNodeData({ resStatusCode: 300 }) });
    const n5 = createNode({ key: "n5", data: createNodeData({ resStatusCode: 300 }) });
    const n6 = createNode({ key: "n6", data: createNodeData({ resStatusCode: 300 }) });
    n1.childrenStatic["n3"] = n3;
    n3.childrenStatic["n4"] = n4;
    n2.childrenStatic["n5"] = n5;
    n1.childrenStatic["n6"] = n6;
    const root = createNode({ key: "", childrenStatic: { n1, n2 }, data: createNodeData({ resBody: { required: ["n/a"] } }) });
    const matches = findAllMatches(["a", "users"], insertedNode, root);
    expect(matches).toHaveLength(1);
  });

  it("should match in the middle of a path among competing options", () => {
    const nodeData = createNodeData();
    const insertedNode = createNode({ key: "new", data: nodeData });
    const n1 = createNode({ key: "n1", data: nodeData });
    const n2 = createNode({ key: "n2", data: createNodeData({ resStatusCode: 300 }) });
    const n3 = createNode({ key: "n3", data: nodeData });
    const n4 = createNode({ key: "n4", data: createNodeData({ resStatusCode: 300 }) });
    const n5 = createNode({ key: "n5", data: createNodeData({ resStatusCode: 300 }) });
    const n6 = createNode({ key: "n6", data: createNodeData({ resStatusCode: 300 }) });
    const n7 = createNode({ key: "n7", data: nodeData });
    const n8 = createNode({ key: "n8", data: createNodeData({ resStatusCode: 300 }) });
    const n9 = createNode({ key: "n9", data: createNodeData({ resStatusCode: 300 }) });
    const n0 = createNode({ key: "n0", data: nodeData });
    const n11 = createNode({ key: "n11", data: nodeData });
    // root - 1 - 6
    n1.childrenStatic["n6"] = n6;
    // root - 1 - 3 - 4 - (7,8,0) - (7-11)
    n1.childrenStatic["n3"] = n3;
    n3.childrenStatic["n4"] = n4;
    n4.childrenStatic["n7"] = n7;
    n4.childrenStatic["n8"] = n8;
    n4.childrenStatic["n0"] = n0;
    n7.childrenStatic["n11"] = n11;
    // root - 2 - 5 - 9
    n2.childrenStatic["n5"] = n5;
    n5.childrenStatic["n9"] = n9;
    // Where 7, 0, 11, 1, and 3 are matches
    // With only 7 and 0 be valid (same path length)
    const root = createNode({ key: "", childrenStatic: { n1, n2 }, data: createNodeData({ resBody: { required: ["n/a"] } }) });
    const matches = findAllMatches(["a", "b", "c", "d"], insertedNode, root);
    expect(matches).toHaveLength(2);
  });
})