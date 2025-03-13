import { describe, it, expect } from "vitest";
import { removeNodes, insertNode } from "./operations.js";
import { createNode } from "../utils/index.js";

describe("operations", () => {
  describe("removeNodes", () => {
    it("should remove static nodes", () => {
      const root = createNode({ key: "root" });
      const child = createNode({ key: "users", parent: root });
      root.childrenStatic["users"] = child;

      removeNodes([child]);
      expect(root.childrenStatic["users"]).toBeUndefined();
    });

    it("should remove dynamic nodes", () => {
      const root = createNode({ key: "root" });
      const child = createNode({ key: "{id}", parent: root });
      root.childrenDynamic.push(child);

      removeNodes([child]);
      expect(root.childrenDynamic).toHaveLength(0);
    });
  });

  describe("insertNode", () => {
    it("should insert static nodes", () => {
      const root = createNode({ key: "root" });
      const node = createNode({ key: "users" });

      insertNode(["users"], node, root);
      expect(root.childrenStatic["users"]).toBe(node);
    });

    it("should insert dynamic nodes", () => {
      const root = createNode({ key: "root" });
      const node = createNode({ key: "{id}" });

      insertNode(["{id}"], node, root);
      expect(root.childrenDynamic[0]).toBe(node);
    });
  });
});
