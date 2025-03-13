import { describe, it, expect } from 'vitest';
import { isValidUrl } from './is-valid-url.js';

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('https://example.com/api/users')).toBe(true);
    expect(isValidUrl('https://example.com/api/data')).toBe(true);
    expect(isValidUrl('https://example.com/api/v1/products')).toBe(true);
    expect(isValidUrl('https://example.com')).toBe(true);
  });

  it('should return false for URLs ending with .json', () => {
    expect(isValidUrl('https://example.com/data.json')).toBe(false);
    expect(isValidUrl('https://example.com/api/users.JSON')).toBe(false);
    expect(isValidUrl('https://example.com/api/v1/config.json')).toBe(false);
    expect(isValidUrl('/local/path/file.json')).toBe(false);
  });

  it('should handle empty strings', () => {
    expect(isValidUrl('')).toBe(true);
  });
});