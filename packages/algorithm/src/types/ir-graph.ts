export type { Entry as HarEntry } from "har-format";

import { NodeData } from "./ir-graph-node-data.js";

export type IrNode = {
  // E.g. /a/b. Use a map to avoid search
  childrenStatic: { [part: string]: IrNode };
  // E.g. /a/{b}. Here {b} matches all strings (excluding /)
  // This should be sorted, so that the most specific paths are matched first
  // Comparator here is the URI template specificity
  childrenDynamic: Array<IrNode>;
  parent: IrNode | null;
  data: NodeData | null;
  key: string;
}

export type HostToNode = { [host: string]: IrNode };
