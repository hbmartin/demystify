import decodeUriComponent from "decode-uri-component";
import { HarEntry } from "../types/index.js";

/**
 * Mutates the given HAR entry to decode the response
 */
const decodeResponse = (h: HarEntry): HarEntry => {
  const { encoding, text } = h.response.content;
  if (!encoding || !text) return h;
  switch (encoding.toLowerCase()) {
    case "base64":
      h.response.content.text = atob(text);
      h.response.content.encoding = "utf-8";
  }
  return h
};

/**
 * There are string checks against certain fields
 * 
 * To ensure compatability with HAR, case conventions are enforced
 * 
 * These are equivalent to the default case for a HAR field
 * 
 * Edits in-place for speed
 */
export const formatHar = (h: HarEntry): HarEntry => {
  decodeResponse(h);
  h.request.method = h.request.method.toLowerCase();
  h.request.url = decodeUriComponent(h.request.url);
  return h;
};
