import { HarEntry } from "../types/index.js";

const harEntryIsGraphQl = (harEntry: HarEntry): boolean => {
  const requestText = harEntry.request?.postData?.text?.toLowerCase() || '';
  const responseText = harEntry.response?.content?.text?.toLowerCase() || '';
  
  const graphqlKeywords = ['query', 'mutation', 'subscription', '__schema'];
  
  return graphqlKeywords.some(keyword => 
    requestText.includes(keyword) || responseText.includes(keyword)
  ) || requestText.includes('{"operationname"');
};

export const isHarGraphQl = (harEntry: HarEntry): boolean => {
  // return url.includes('graphql') && entry.request.postData && entry.request.postData.mimeType == 'application/json'
  // const url = harEntry.request.url.toLowerCase();
  const isMimeTypeApplicationJson = harEntry.request?.postData?.mimeType === 'application/json';
  if (!isMimeTypeApplicationJson) return false;
  // const includesGraphQlInUrl = url.includes('graphql');
  // if (includesGraphQlInUrl) return true;
  const isValidGraphQl = harEntryIsGraphQl(harEntry);
  return isValidGraphQl;
}
