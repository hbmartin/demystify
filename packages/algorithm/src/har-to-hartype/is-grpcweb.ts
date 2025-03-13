import { HarEntry } from "../types/index.js";

export const isHarGrpcWeb = (harEntry: HarEntry): boolean => {
  const contentType = harEntry.response?.content?.mimeType?.toLowerCase() || '';
  const acceptHeader = harEntry.request?.headers?.find(h => h.name.toLowerCase() === 'accept')?.value?.toLowerCase() || '';
  
  return contentType.includes('application/grpc-web') || 
    contentType.includes('application/grpc') ||
    acceptHeader.includes('application/grpc-web') ||
    acceptHeader.includes('application/grpc');
};
