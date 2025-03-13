import contentType from "content-type";
import { HarEntry } from "../types/index.js";

/**
 * E.g. valid: application/json
 * E.g. invalid: application/json+protobuf or text/plain
 */
const validMimes = [
  // For grpc-web, see https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md#protocol-differences-vs-grpc-over-http2
  // GraphQL happens over application/json
  "application/json",
  "application/xml",
]

const getMimeType = (har: HarEntry): string | null => {
  try {
    const mimeType = contentType.parse(har.response.content.mimeType.toLowerCase());
    return mimeType.type;
  } catch {
    return null;
  }
};

const isKnownToBeValid = (mimeType: string): boolean => {
  const typeFormatted = mimeType.toLowerCase();
  return validMimes.some(m => typeFormatted === m);
};

/**
 * By "invalid", it is meant that we wish to exclude requests with certain mime types
 */
export const isValidMime = (har: HarEntry): boolean => {
  const mimeType = getMimeType(har);
  if (!mimeType) return false;
  const valid = isKnownToBeValid(mimeType);
  return valid;
};
