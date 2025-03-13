import { intersection } from "lodash";
import { areSchemasEqual } from 'genson-js';
import { IrNode } from "../types/ir-graph.js";
import {
  matchDynamicChildren
} from "../utils/dynamic-children-helpers.js";

/**
 * Find all matching nodes in the IR tree for a given pathname
 * Matches meet the following criteria:
 *  - same length e.g. /a/b = 2
 *  - by comparator
 * The default comparator looks for equivalent request and response
 * schema for 2xx status codes of an endpoint
 * 
 * When () => true, all nodes of the same level are returned,
 * regardless of their data
 */
export const findAllMatches = (
  pathname: string[],
  insertedNode: IrNode,
  rootNode: IrNode,
  comparator: (a: IrNode, b: IrNode) => boolean = isEquivalent,
): IrNode[] => {
  return dfs(pathname, insertedNode, rootNode, comparator);
};

/**
 * Equivalence check for two nodes. Conditions:
 *  - Both nodes have a matching response, with the same method, status code, and mime type
 *  - This response and its request is equal in dest and src
 * @param dest The existing node
 * @param src The new node we wish to merge
 */
const isEquivalent = (dest: IrNode, src: IrNode): boolean => {
  // Confirm methods exist
  if (!dest.data?.methods || !src.data?.methods) {
    return false;
  }
  const methodsIntersect = intersection(Object.keys(dest.data.methods), Object.keys(src.data.methods));
  // Confirm that both nodes have at least one matching method
  if (!methodsIntersect.length) {
    return false;
  }

  for (const method of methodsIntersect) {
    const endpointDest = dest.data.methods[method];
    const endpointSrc = src.data.methods[method];
    if (!endpointDest?.response || !endpointSrc?.response) {
      return false;
    }
    for (const statusCode of Object.keys(endpointSrc.response)) {
      for (const mediaType of Object.keys(endpointSrc.response[statusCode] || [])) {
        const responseDestBody = endpointDest.response[statusCode]?.[mediaType]?.body;
        const responseSrcBody = endpointSrc.response[statusCode]?.[mediaType]?.body;
        // Check for undefined, which is not a JSON primitive and indicates no observed data
        // Whereas null is a valid JSON response that may define an endpoint
        if (!responseDestBody || !responseSrcBody) {
          continue;
        }
        // If the responses are equal, verify the request is also equal. If so, it is a match
        if (areSchemasEqual(responseDestBody, responseSrcBody)) {
          if (!endpointDest.request || !endpointSrc.request) {
            return true;
          }
          const requestDestBody = endpointDest.request[mediaType]?.body;
          const requestSrcBody = endpointSrc.request[mediaType]?.body;
          if (requestDestBody && requestSrcBody && areSchemasEqual(requestDestBody, requestSrcBody)) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

const dfs = (
  pathname: string[],
  insertedNode: IrNode,
  currentNode: IrNode,
  comparator: (a: IrNode, b: IrNode) => boolean,
  results: IrNode[] = [],
): IrNode[] => {
  if (pathname.length === 0) {
    return results;
  }
  const part = pathname[0]!;
  const isLast = pathname.length === 1;
  const childDynamic = matchDynamicChildren(part, currentNode.childrenDynamic);
  if (isLast) {
    const staticChildren = Object.values(currentNode.childrenStatic);
    for (const leaf of staticChildren) {
      if (comparator(insertedNode, leaf)) {
        results.push(leaf);
      }
    }
    if (childDynamic) {
      if (comparator(insertedNode, childDynamic)) {
        results.push(childDynamic);
      }
    }
    return results;
  }
  const items = Object.values(currentNode.childrenStatic);
  if (childDynamic) {
    items.push(childDynamic);
  }
  for (const value of items) {
    results.push(...dfs(
      pathname.slice(1),
      insertedNode,
      value,
      comparator,
      [],
    ));
  }
  return results;
};

