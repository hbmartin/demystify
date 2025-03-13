import { IrNode, NodeData } from "../types/index.js";

type CreateNode = (params: Partial<IrNode>) => IrNode;

const defaults: IrNode = {
  key: '',
  parent: null,
  childrenStatic: {},
  childrenDynamic: [],
  data: null,
};

export const createNode: CreateNode = (params = {}) => {
  return {
    ...defaults,
    parent: params.parent as IrNode || null,
    childrenStatic: params.childrenStatic as { [k: string]: IrNode } || {},
    childrenDynamic: params.childrenDynamic as Array<IrNode> || [],
    data: params.data as NodeData || null,
    key: params.key || '',
  };
};
