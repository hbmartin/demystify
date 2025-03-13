import { HarEntry } from "../types/index.js";

const isNotUndefined = (value: unknown): value is Exclude<typeof value, undefined> => value !== undefined;

const isMethodValid = (method: string) =>
  new Set(["GET", "POST", "PUT", "DELETE", "PATCH"]).has(method.toUpperCase());

export const isHarRestJson = (harEntry: HarEntry): boolean => {
  if (!isMethodValid(harEntry.request.method)) return false;
  const requestBody = harEntry.request?.postData?.text || "";
  const responseBody = harEntry.response?.content?.text || "";

  try {
    if (requestBody) {
      JSON.parse(requestBody);
    }

    if (responseBody) {
      JSON.parse(responseBody);
    }

    return isNotUndefined(requestBody || responseBody);
  } catch {
    return false;
  }
};
