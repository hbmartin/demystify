import { describe, it, expect } from 'vitest';
import { automaticParameterisation } from './automatic-parameterisation.js';
import { Representor } from '../representor.js';
import { createContent, createHarEntry } from '../__helpers__/index.js';
import parameterisedCallsHar1 from "../__fixtures__/parameterisedcalls1.json" with { type: "json"};
import { Entry } from 'har-format';

const host = "api.example.com";
const href = `https://${host}`;
const mimeType = "application/json";
const method = "post";

describe('automaticParameterisation', () => {
  it('should automatically update to /a/b/c/d/{dynamic}', () => {
    const pathname = ["api", "rest_v1", "page", "summary", "elisha_rumsey"];
    const representor = new Representor();
    for (const entry of parameterisedCallsHar1.log.entries) {
      representor.upsert(entry as Entry);
    }
    const insertedNode = representor.rest.data["en.wikipedia.org"]!
      .childrenStatic["api"]!
      .childrenStatic["rest_v1"]!
      .childrenStatic["page"]!
      .childrenStatic["summary"]!
      .childrenDynamic[0]!;
    automaticParameterisation({
      pathname,
      insertedNode,
      rootNode: representor.rest.data["en.wikipedia.org"]!,
      method,
      mimeType,
    });
    const data = representor.rest.data["en.wikipedia.org"]!
      .childrenStatic["api"]!
      .childrenStatic["rest_v1"]!
      .childrenStatic["page"]!
      .childrenStatic["summary"]!
    expect(Object.keys(data.childrenStatic)).toHaveLength(0);
    expect(data.childrenDynamic[0]!.key).toBe("{summary}");
    expect(data.childrenDynamic).toHaveLength(1);
  });

  it('should automatically update to /a/{} given /a and /a/b/c', () => {
    // Test after upserting observations
    // /a/b -> request1 (match)
    // /a/c -> request1 (match)
    // /a -> request2
    // /a -> request1
    // /a/b/c -> request1
    // Then parameterise path ["a", "b"]
    // This gives
    // /a -> request1 & request2
    // /a/{} -> request1
    // /a/b/c -> request1
    const pathname = ["a", "b"];
    const representor = new Representor();
    const request1 = createContent({ test: 1 });
    const request2 = createContent({ test: false });
    representor.upsert(
      createHarEntry({ url: `${href}/a/b`, request: request1 })
    );
    representor.upsert(
      createHarEntry({ url: `${href}/a/c`, request: request1 })
    );
    representor.upsert(
      createHarEntry({ url: `${href}/a`, request: request2 })
    );
    representor.upsert(
      createHarEntry({ url: `${href}/a`, request: request1 })
    );
    representor.upsert(
      createHarEntry({ url: `${href}/a/b/c`, request: request1 })
    );
    const insertedNode = representor.rest.data[host]!.childrenStatic["a"]!.childrenDynamic[0]!;
    automaticParameterisation({
      pathname,
      insertedNode,
      rootNode: representor.rest.data[host]!,
      method,
      mimeType,
    });
    let node = representor.rest.data[host]!;
    const lvl1 = node.childrenStatic["a"]!
    expect(lvl1.data?.methods["post"]!.request!["application/json"]?.body).toEqual({
      properties: {
        test: {
          type: ["boolean", "integer"]
        }
      },
      required: [
        "test",
      ],
      type: "object",
    });
    const lvl2dynamic = lvl1.childrenDynamic[0]!;
    expect(lvl2dynamic.childrenDynamic).toHaveLength(0);
    expect(Object.keys(lvl2dynamic.childrenStatic)).toHaveLength(0);
    expect(lvl2dynamic.parent).not.toBeNull();
    expect(lvl2dynamic.key).toBe("{a}");
    expect(lvl2dynamic.data).not.toBeNull();
    const lvl2static = lvl1.childrenStatic["b"]!;
    expect(lvl2static.data).toBeNull();
    expect(lvl2static.key).toBe("b");
  });
});
