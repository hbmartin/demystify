import { describe, it, expect } from 'vitest';
import { isValidMethod } from './is-valid-method.js';
import { lowerCase } from 'lodash';

describe('isValidMethod', () => {
  it('should return true for all valid methods in uppercase or lowercase', () => {
    const validMethods = [
      'CONNECT', 'DELETE', 'GET', 'HEAD',
      'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE',
    ];
    validMethods.push(...validMethods.map(lowerCase))
    validMethods.forEach(method => {
      expect(isValidMethod(method)).toBe(true);
    });
  });

  it('should return false for common invalid methods', () => {
    const invalidMethods = ['FOO', 'BAR', 'GETS', 'HEADS', '', 'gett', 'post '];
    invalidMethods.forEach(method => {
      expect(isValidMethod(method)).toBe(false);
    });
  });
});