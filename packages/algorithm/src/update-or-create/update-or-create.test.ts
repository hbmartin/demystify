import { describe, it, expect } from "vitest";
import { updateOrCreate } from "./update-or-create.js";
import { HarRestJson } from "../types/index.js";
import { createNode } from "../utils/index.js";
import restPostHar from "../__fixtures__/rest-post.json" with { type: "json" };
import restPostHarAlt from "../__fixtures__/rest-post-alt.json" with { type: "json" };
import xmlHar from "../__fixtures__/xml.json" with { type: "json" };
import { ValidHar } from "../har-to-hartype/index.js";

describe("findOrCreate REST JSON", () => {
  const data: ValidHar = {
    har: restPostHar.log.entries[0] as HarRestJson,
    kind: "rest-json",
  };
  it("when rootNode is not provided, return a new root node matching snapshot", () => {
    const result = updateOrCreate({ data, rootNode: null });
    expect(result.root).toMatchSnapshot();
  });

  it("operations are idempotent", () => {
    const rootNode = createNode({ key: "example.com" });
    const result = updateOrCreate({ data, rootNode });
    const foundNode = updateOrCreate({ data, rootNode: result.root });
    expect(foundNode).toEqual(result);
  });
});

describe("findOrCreate REST JSON alternative", () => {
  const dataOne: ValidHar = {
    har: restPostHarAlt.log.entries[0] as HarRestJson,
    kind: "rest-json",
  };
  const dataTwo: ValidHar = {
    har: restPostHar.log.entries[0] as HarRestJson,
    kind: "rest-json",
  };
  it("when rootNode is not provided, return a new root node matching snapshot", () => {
    const result = updateOrCreate({ data: dataOne, rootNode: null });
    expect(result.root).toMatchSnapshot();
  });

  it("merges harEntry into an existing node", () => {
    const resultOne = updateOrCreate({ data: dataOne, rootNode: null });
    const resultTwo = updateOrCreate({ data: dataTwo, rootNode: resultOne.root });
    expect(resultTwo.root).toMatchSnapshot();
  });
});

describe("findOrCreate XML", () => {
  const data: ValidHar = {
    har: xmlHar.log.entries[0] as HarRestJson,
    kind: "rest-xml",
  };
  it("when rootNode is not provided, return a new root node matching snapshot", () => {
    const result = updateOrCreate({ data, rootNode: null });
    expect(result.root).toMatchSnapshot();
  });

  it("merges data into an existing node", () => {
    const resultOne = updateOrCreate({ data, rootNode: null });
    const resultTwo = updateOrCreate({ data, rootNode: resultOne.root });
    expect(resultTwo.root).toMatchSnapshot();
  });

  it("operations are idempotent", () => {
    const rootNode = createNode({ key: "example.com" });
    const result = updateOrCreate({ data, rootNode });
    const foundNode = updateOrCreate({ data, rootNode: result.root });
    expect(foundNode).toEqual(result);
  });
});

describe("updateOrCreate Additional Cases", () => {
  it("handles an empty path in the HAR request", () => {
    const data: ValidHar = {
      har: {
        request: {
          method: "GET",
          url: "http://example.com",
          headers: [],
          queryString: [],
          cookies: [],
          httpVersion: "",
          bodySize: 0,
          headersSize: 0,
        },
        response: {
          status: 200,
          content: { mimeType: "application/json", text: "" },
          headers: [],
          cookies: [],
          redirectURL: "",
          headersSize: 0,
          bodySize: 0,
        },
        startedDateTime: "",
        time: 0,
      } as unknown as HarRestJson,
      kind: "rest-json",
    };
    const result = updateOrCreate({ data, rootNode: null });
    expect(result).toBeDefined();
  });

  it("merges multiple times with no path changes", () => {
    const data: ValidHar = {
      har: restPostHar.log.entries[0] as HarRestJson,
      kind: "rest-json",
    };
    const firstUpdate = updateOrCreate({ data, rootNode: null });
    const secondUpdate = updateOrCreate({ data, rootNode: firstUpdate.root });
    const thirdUpdate = updateOrCreate({ data, rootNode: secondUpdate.root });
    expect(thirdUpdate.root).toEqual(secondUpdate.root);
  });

  it("handles missing response content gracefully", () => {
    const data: ValidHar = {
      har: {
        ...restPostHar.log.entries[0],
        response: {
          ...restPostHar.log.entries[0]!.response,
          content: { mimeType: "", text: "" },
        },
      } as HarRestJson,
      kind: "rest-json",
    };
    const result = updateOrCreate({ data, rootNode: null });
    expect(result).toBeDefined();
  });
});
