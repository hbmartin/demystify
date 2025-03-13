import { cloneDeep } from "lodash";
import { IrNode } from "../types/index.js";
import {
  isPartDynamic,
} from "./operations.js";

const stripTrailingS = (str: string): string => {
  return str.replace(/s$/, '');
};

/**
 * Returns a pathname by ascending the tree
 */
export const getPathnameFromNode = (node: IrNode): string[] => {
  if (!node.parent) return [node.key];
  return [...getPathnameFromNode(node.parent), node.key];
};

const generateKey = (pathname: string[], changeIdx: number): string => {
  const nameExists = (name: string, pthnm: string[]): boolean => {
    for (let i = pthnm.length - 1; i >= 0; i--) {
      // When the check reaches the root, there's no match
      if (pthnm[i] === '' && name === '') {
        return false;
      }
      if (pthnm[i] === name) {
        return true;
      }
    }
    return false;
  };

  // Go in reverse order through the split pathname e.g. ["api","post"] = "/api/post"
  // Off by -1 here, because the last part is dynamic and thus unreliable
  for (let i = pathname.length - 2; i > 0; i--) {
    // If this is a static part, check if has been used before, if not, use it
    const part = pathname[i] || '';
    const partIsStatic = !isPartDynamic(part);
    if (partIsStatic && !nameExists(part, pathname.slice(0, pathname.length-2))) {
      return `{${stripTrailingS(part!)}}`;

    }
  }
  return `{param${changeIdx}}`;
};

const updateNodeKeys = (pathname: string[], irNode: IrNode): void => {
  if (!pathname.length) return;
  const part = pathname[0]!;
  const isDynamic = isPartDynamic(part);
  if (isDynamic) {
    irNode.key = part;
  }
  if (irNode.parent) {
    updateNodeKeys(pathname.slice(1), irNode.parent);
  }
};

/**
 * Sets path parameters in the IR tree based on the candidate paths
 * E.g. for /a/b and /a/c the second element is a path parameter
 * Heuristic is to look behind for a static part and use that as the parameter name unless taken
 * All nodes must be of the same level (i.e. same depth in the tree, from root = '')
 */
export const setPathParameterNames = (irNode: IrNode, candidates: IrNode[]): void => {
  const irPathname = getPathnameFromNode(irNode);
  // E.g. "/1/{2}/3" = [false, true, false] (static, dynamic, static) - braces parameterise {}
  // Used as a sort of mask to determine dynamic parts based on candidate paths
  const dynamicElseStatic: Array<boolean> = irPathname.map(() => false);
  for (const candidate of candidates) {
    const candidatePathname = getPathnameFromNode(candidate);
    for (let i = 0; i < irPathname.length; i++) {
      if (irPathname[i] !== candidatePathname[i]) {
        dynamicElseStatic[i] = true;
      }
    }
  }
  // Determine name based on the previous static part, ensuring each path parameter name is unique
  // Update irPathname indices
  for (let isDynamicPartIdx = 0; isDynamicPartIdx < dynamicElseStatic.length; isDynamicPartIdx++) {
    const isDynamicPart = dynamicElseStatic[isDynamicPartIdx]!;
    if (isDynamicPart) {
      irPathname[isDynamicPartIdx] = generateKey(irPathname.slice(0, isDynamicPartIdx + 1), isDynamicPartIdx)
    }
  }
  // Update node keys in irNode, each of which is an ordered part of a pathname
  const reversed = cloneDeep(irPathname);
  reversed.reverse();
  updateNodeKeys(reversed, irNode);
};
