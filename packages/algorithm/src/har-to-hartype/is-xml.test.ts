import { expect, test } from 'vitest'
import { HarEntry } from '../types/index.js'
import { isHarXml } from './is-xml.js'
import xmllHar from '../__fixtures__/xml.json' with { type: 'json' }
import graphQlHar from '../__fixtures__/graphql.json' with { type: 'json' }
import restPostHar from '../__fixtures__/rest-post.json' with { type: 'json' }
import grpcwebHar from '../__fixtures__/grpcweb.json' with { type: 'json' }

test.each([
  ['matching request', xmllHar.log.entries[0], true],
  ['non-matching request', restPostHar.log.entries[0], false],
  ['non-matching request', graphQlHar.log.entries[0], false],
  ['non-matching request', grpcwebHar.log.entries[0], false],
])('Returns %s when the har entry is %s', (_, entry, expected) => {
  expect(isHarXml(entry as unknown as HarEntry)).toBe(expected);
});
