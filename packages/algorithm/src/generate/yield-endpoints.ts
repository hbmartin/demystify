import { IrNode, NodeData } from "../types/index.js";

interface EndpointNode extends IrNode {
  data: NodeData;
}

export type Endpoint = {
  node: EndpointNode;
  pathname: string[];
};

function* yieldValuesInTree(
  node: IrNode,
  pathname: string[] = []
): Generator<Endpoint> {
  if (node.data) {
    yield {
      node: node as EndpointNode,
      pathname: [...pathname, node.key],
    };
  }
  if (node.childrenStatic) {
    for (const child of Object.values(node.childrenStatic)) {
      yield* yieldValuesInTree(child, [...pathname, node.key]);
    }
  }
  if (node.childrenDynamic) {
    for (const child of node.childrenDynamic) {
      yield* yieldValuesInTree(child, [...pathname, node.key]);
    }
  }
}

export function* yieldEndpoints(
  nodes: IrNode[],
  pathname: string[] = []
): Generator<Endpoint> {
  for (const node of nodes) {
    yield* yieldValuesInTree(node, pathname);
  }
}
