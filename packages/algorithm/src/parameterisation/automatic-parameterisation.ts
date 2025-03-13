import { negate, isEqual } from "lodash";
import { IrNode } from "../types/index.js";
import { isNodeDynamic } from "../utils/dynamic-children-helpers.js";
import { parameterise } from "./parameterise.js";
import { findAllMatches } from "./find-matches.js";

/**
 * Does a node or any of its parents have dynamic parts?
 * Defined as a key that is a path parameter
 * Meaning, enclosed in {} - /example/{id}
 */
const hasDynamicParts = (node: IrNode): boolean => {
  if (!node.parent) return false;
  if (isNodeDynamic(node)) return true;
  return hasDynamicParts(node.parent);
};

const hasPartInCommon = (p1: string[], p2: string[]): boolean => {
  return p1.some((part) => p2.includes(part));
};

const getParameterisedPathname = (path1: string[], path2: string[]): string[] => {
  const result: string[] = [];
  for (let i = 0; i < path1.length; i++) {
    if (path1[i] && path1[i] === path2[i]) {
      result.push(path1[i]!);
    } else {
      result.push(`{${path1[i]}}`);
    }
  }
  return result;
};

/**
 * A canadidate has:
 *  - same length e.g. /a/b = 2
 *  - no existing dynamic parts
 *  - exclude self
 *  - has a least one static part in common
 *  - the same data
 */

type Param = {
  // /a/b -> ["a", "b"]
  pathname: string[];
  // The node that was inserted and will be the reference point for checks
  insertedNode: IrNode;
  // The root of the IR
  rootNode: IrNode;
  // The method of the request
  method: string;
  // The mime type of the request
  mimeType: string;
}

/**
 * Automatically parameterises similar paths in the OpenAPI IR tree
 * This operation is idempotent
 * @param rootNode The root node of the IR tree
 */
export const automaticParameterisation = (param: Param): void => {
  const { pathname, insertedNode, rootNode, method, mimeType } = param;
  if (isNodeDynamic(insertedNode)) return;
  const matches = findAllMatches(pathname, insertedNode, rootNode);
  // Remove any matches that have path parameters
  // This means we never parameterise a path twice
  // The implementation identifies all parameters in one go
  const noDynamicParts = matches.filter(negate(hasDynamicParts));
  // Heuristic: two paths must have the same number of parts, and at least one part in common
  const partInCommon = noDynamicParts.filter((match) =>
    hasPartInCommon(pathname, match.data?.mostRecentPathname.split("/") || []));
  const excludingSelf = partInCommon.filter((match) => match.data?.mostRecentPathname !== insertedNode.data?.mostRecentPathname);
  for (const match of excludingSelf) {
    const matchData = match.data?.methods[method]?.request?.[mimeType]?.body;
    const nodeData = insertedNode.data?.methods[method]?.request?.[mimeType]?.body;
    if (isEqual(matchData, nodeData)) {
      const newName = getParameterisedPathname(pathname, match.data?.mostRecentPathname.split("/").slice(1) || []);
      parameterise(newName, insertedNode, rootNode);
    }
  }
};
