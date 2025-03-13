import { IrNode } from '../types/index.js';

export const getStaticChildMatch = (key: string, node: IrNode): IrNode | null => {
  if (!node.childrenStatic) return null;
  return node.childrenStatic[key] || null;
}

export const hasNoChildren = (node: IrNode): boolean => {
  return Object.keys(node.childrenStatic).length + node.childrenDynamic.length === 0;
};
