import { HarRestJson, HarRestXml } from '../types/index.js';

export const pathToParts = (harEntry: HarRestJson | HarRestXml): string[] => {
  const url = new URL(harEntry.request.url);
  return url.pathname
    .split('/')
    .filter(part => part.length > 0);
};
