import { IrNode } from '../types/index.js';
import { pathToParts } from './path-to-parts.js';
import { createNodeData } from './create-node-data.js';
import { createNode } from '../utils/index.js';
import { ValidHar } from '../har-to-hartype/index.js';
import { mergeNodeData } from './merge-node-data.js';
import { getStaticChildMatch } from '../utils/index.js';
import { matchDynamicChildren } from '../utils/dynamic-children-helpers.js';

type UpdateOrCreateNodeParams = {
  node: IrNode;
  parts: string[];
  data: ValidHar;
}

function updateOrCreateNode({ node, parts, data }: UpdateOrCreateNodeParams): IrNode {
  // Base case, no more parts to match. Update or create the node
  // If node.data is null, then it becomes the harEntry (create)
  // Otherwise, merge the harEntry into the existing data (update)
  if (parts.length === 0) {
    const src = createNodeData({ data });
    const dest = node.data;
    if (!dest) node.data = src;
    else node.data = mergeNodeData(dest, src);
    return node;
  }
  const part = parts[0]!;
  const dynamicMatch = matchDynamicChildren(part, node.childrenDynamic);
  // Look at dynamic nodes first
  // This is important because we want to match against this first, should it exist
  // Prior to going down that path, confirm that an endpoint exists in the subgraph
  if (dynamicMatch && nodeHasDataForPath(dynamicMatch, parts.slice(1))) {
    return updateOrCreateNode({ node: dynamicMatch, parts: parts.slice(1), data });
  }
  // Look for an existing match, if found, continue the search
  const staticMatch = getStaticChildMatch(part, node);
  if (staticMatch) {
    return updateOrCreateNode({ node: staticMatch, parts: parts.slice(1), data });
  }
  // Create a node if no match is found
  // If we get to this point, parts is non-empty and there is neither a static or dynamic match
  node.childrenStatic ??= {};
  node.childrenStatic[part] = createNode({ key: part, parent: node });
  return updateOrCreateNode({ node: node.childrenStatic[part], parts: parts.slice(1), data });
}

const nodeHasDataForPath = (node: IrNode, parts: string[]): boolean => {
  if (parts.length === 0) {
    if (node.data) {
      return true;
    }
    return false;
  }
  const part = parts[0]!;
  if (node.childrenStatic && node.childrenStatic[part]) {
    if (nodeHasDataForPath(node.childrenStatic[part], parts.slice(1))) {
      return true;
    }
  }
  for (const dynamicNode of node.childrenDynamic) {
    if (nodeHasDataForPath(dynamicNode, parts.slice(1))) {
      return true;
    }
  }
  return false;
};

type UpdateOrCreateParams = {
  data: ValidHar;
  rootNode: IrNode | null;
}
export function updateOrCreate({ data, rootNode }: UpdateOrCreateParams): { root: IrNode, inserted: IrNode } {
  const { har } = data;
  if (!rootNode) {
    const host = new URL(har.request.url).host;
    rootNode = createNode({ key: host });
  }
  const newNode = updateOrCreateNode({
    node: rootNode,
    parts: pathToParts(har),
    data,
  });
  return { root: rootNode, inserted: newNode };
}
