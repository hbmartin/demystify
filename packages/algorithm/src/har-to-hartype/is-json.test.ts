import { expect, test } from "vitest";
import { HarEntry } from "../types/index.js";
import { isHarRestJson } from "./is-json.js";
import xmlHar from "../__fixtures__/xml.json" with { type: "json" };
import restPostHar from "../__fixtures__/rest-post.json" with { type: "json" };
import grpcwebHar from "../__fixtures__/grpcweb.json" with { type: "json" };
import { createHarEntry } from "../__helpers__/index.js";
import { cloneDeep } from "lodash";

type TestCase = [string, HarEntry, boolean];
type TestCases = Array<TestCase>;
const invalidHttpMethods = ["HEAD", "OPTIONS", "CONNECT", "TRACE"];
const methodTests: TestCases = invalidHttpMethods.map((method) => [
  `matching rest request with invalid method ${method}`,
  createHarEntry({ method }),
  false,
]);
const harWithEmptyStringReqResBody = () => {
  const cloned = cloneDeep(restPostHar);
  cloned.log.entries[0]!.request.postData.text = "";
  cloned.log.entries[0]!.response.content.text = "";
  const out = ["matches when request or response is an empty string", cloned.log.entries[0] as HarEntry, true];
  return out as TestCase;
};
const tests: TestCases = [
  ["matching request", restPostHar.log.entries[0] as HarEntry, true],
  ["non-matching xml request", xmlHar.log.entries[0] as HarEntry, false],
  [
    "non-matching graphql request",
    grpcwebHar.log.entries[0] as HarEntry,
    false,
  ],
  ...methodTests,
  harWithEmptyStringReqResBody(),
];

// Exclude graphql, as we will look for it beforehand
test.each(tests)(
  "Returns %s when the har entry meets expectations",
  (_, entry, expected) => {
    expect(isHarRestJson(entry)).toBe(expected);
  }
);
