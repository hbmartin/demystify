import { Content } from 'har-format';

export * from './create-har-entry.js';
export * from './create-node-data.js';

export const createContent = (obj: object): Content => ({
  mimeType: "application/json",
  text: JSON.stringify(obj),
  size: 0,
});
