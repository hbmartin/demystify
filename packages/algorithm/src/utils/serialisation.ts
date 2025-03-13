import { cloneDeep } from "lodash";
import stringify from "json-stable-stringify";
import { HostToNode, IrNode } from "../types/index.js";

export const serialiseRest = (data: HostToNode): string | null => {
  const cloned = cloneDeep(data);
  const stripParentProperty = (node: IrNode) => {
    if (node.parent) {
      // @ts-expect-error
      delete node.parent;
    }
    node.childrenDynamic.forEach(stripParentProperty);
    Object.values(node.childrenStatic).forEach(stripParentProperty);
  };
  Object.values(cloned).forEach(stripParentProperty);
  return stringify(cloned) || null;
};
