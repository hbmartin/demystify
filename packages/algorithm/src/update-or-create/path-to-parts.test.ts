import { describe, expect, test } from 'vitest';
import { pathToParts } from './path-to-parts.js';
import { HarRestJson } from '../types/index.js';

describe('pathToParts', () => {
  test('should split URL pathname into parts', () => {
    const harEntry: HarRestJson = {
      request: {
        url: 'https://api.example.com/users/123/posts',
        // other required properties would go here
      }
    } as HarRestJson;

    const result = pathToParts(harEntry);
    expect(result).toEqual(['users', '123', 'posts']);
  });

  test('should handle root path', () => {
    const harEntry: HarRestJson = {
      request: {
        url: 'https://api.example.com/',
        // other required properties would go here
      }
    } as HarRestJson;

    const result = pathToParts(harEntry);
    expect(result).toEqual([]);
  });

  test('should handle path with trailing slash', () => {
    const harEntry: HarRestJson = {
      request: {
        url: 'https://api.example.com/users/123/',
        // other required properties would go here
      }
    } as HarRestJson;

    const result = pathToParts(harEntry);
    expect(result).toEqual(['users', '123']);
  });

  test('should handle path with empty segments', () => {
    const harEntry: HarRestJson = {
      request: {
        url: 'https://api.example.com/users//123',
        // other required properties would go here
      }
    } as HarRestJson;

    const result = pathToParts(harEntry);
    expect(result).toEqual(['users', '123']);
  });
});
