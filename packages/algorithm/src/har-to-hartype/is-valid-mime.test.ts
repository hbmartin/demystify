import { it, expect } from "vitest";
import { isValidMime } from "./is-valid-mime.js";
import { HarEntry } from "../types/index.js";

it("should return false for application/json+protobuf mime type", () => {
  const har = {
    response: {
      content: {
        mimeType: "application/json+protobuf",
      },
    },
  } as HarEntry;
  expect(isValidMime(har)).toBe(false);
});

it("should return false for text/plain mime type", () => {
  const har = {
    response: {
      content: {
        mimeType: "text/plain",
      },
    },
  } as HarEntry;
  expect(isValidMime(har)).toBe(false);
});

it("should return true for application/json mime type", () => {
  const har = {
    response: {
      content: {
        mimeType: "application/json",
      },
    },
  } as HarEntry;
  expect(isValidMime(har)).toBe(true);
});

it("should handle uppercase mime types", () => {
  const har = {
    response: {
      content: {
        mimeType: "APPLICATION/JSON",
      },
    },
  } as HarEntry;
  expect(isValidMime(har)).toBe(true);
});

it("should handle empty mime types", () => {
  const har = {
    response: {
      content: {
        mimeType: "",
      },
    },
  } as HarEntry;
  expect(isValidMime(har)).toBe(false);
});
