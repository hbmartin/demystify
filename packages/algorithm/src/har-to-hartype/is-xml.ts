import { HarEntry } from "../types/index.js";

export const isHarXml = (harEntry: HarEntry): boolean => {
  const contentType = harEntry.response?.content?.mimeType?.toLowerCase() || "";
  return contentType.includes("application/xml");
};
