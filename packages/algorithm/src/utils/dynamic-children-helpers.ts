import { IrNode } from "../types/ir-graph.js";
import { createNode } from "./node-creation.js";

/**
 * OpenAPI 4.0 uses URI Template level ~3
 * OpenAPI 3.1 uses URI Template level 1
 * With 4.0, there could be multiple dynamic matches
 * This is not implemented, but could be. For now, just one dynamic match a la OAI 3.1
 */
export const matchDynamicChildren = (
  part: string,
  children: IrNode["childrenDynamic"]
): IrNode | null => {
  if (children.length) return children[0]!;
  return null;
};

/**
 * There can only be one dynamic node given the above. So can just remove it
 * Future versions can implement more advanced URI template levels
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeDynamicChild = (part: string, children: IrNode["childrenDynamic"]) => {
  return [];
};

export const createDynamicChild = (part: string, node: IrNode) => {
  return createNode({ key: part, parent: node });
};

export const isNodeDynamic = ({ key }: IrNode) => key.startsWith("{") && key.endsWith("}");
