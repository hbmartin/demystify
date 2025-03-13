import { it, expect, vi } from "vitest";
import { requestToHar } from "./request-to-har";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

it("should convert DevTools request to HAR entry", async () => {
  const mockRequest: DeepPartial<chrome.devtools.network.Request> = {
    getContent: vi.fn().mockImplementation((callback) => {
      callback("test content", "utf8");
    }),
    response: {
      content: { size: 100},
    },
  };

  const result = await requestToHar(
    mockRequest as chrome.devtools.network.Request
  );

  expect(result.response.content.text).toBe("test content");
  expect(result.response.content.encoding).toBe("utf8");
  expect("getContent" in result).toBe(false);
});

it("should handle empty content", async () => {
  const mockRequest: DeepPartial<chrome.devtools.network.Request> = {
    getContent: vi.fn().mockImplementation((callback) => {
      callback("", null);
    }),
    response: {
      content: {},
    },
  };

  const result = await requestToHar(
    mockRequest as chrome.devtools.network.Request
  );

  expect(result.response.content.text).toBe("");
  expect(result.response.content.encoding).toBeNull();
});
