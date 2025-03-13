import { Schema, createSchema } from "genson-js";
import { HarEntry, JSONType } from "../types/index.js";

export * from './headers.js';
export * from './node-creation.js';
export * from './node-matchers.js';
export * from './serialisation.js';
export * from "./format-har.js";

export class HarUtils {
  static getRequestMethod (harEntry: HarEntry): string {
    return harEntry.request.method.toLowerCase()
  }
}

export const createSchemaElseUndefined = (
  json: JSONType,
  noRequired: boolean = false
): Schema | undefined => {
  if (!json) return undefined;
  return createSchema(json, { noRequired });
};

export const parseJSON = (json?: string): JSONType => {
  if (!json) return null;
  try {
    return JSON.parse(json || "");
  } catch {
    return null;
  }
};
