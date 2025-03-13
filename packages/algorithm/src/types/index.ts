export * from './hartype.js'
export * from './ir-graph.js'
export * from './ir-graph-node-data.js'
export * from './json.js'
export * from './manager.js'

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
};
