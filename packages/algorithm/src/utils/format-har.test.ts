import { describe, it, expect } from 'vitest';
import { formatHar } from './format-har.js';
import { HarEntry } from '../types/index.js';
import { DeepPartial } from '../types/index.js';

describe('formatHar', () => {
  it('should lowercase method, but leave the request url unchanged', () => {
    const har: DeepPartial<HarEntry> = {
      request: {
        url: 'HTTPS://api.EXAMPLE.COM/v1/uSeRs',
        method: 'GET',
        headers: [],
      },
      response: {
        status: 200,
        statusText: 'OK',
        headers: [],
        content: {
          text: 'test',
          mimeType: 'application/json',
        },
      },
    };

    const formatted = formatHar(har as HarEntry);

    expect(formatted.request.url).toBe('HTTPS://api.EXAMPLE.COM/v1/uSeRs');
    expect(formatted.request.method).toBe('get');
  });

  it('should decode base64 encoded response content', () => {
    const har: DeepPartial<HarEntry> = {
      request: {
        url: 'https://api.example.com/v1/users',
        method: 'get',
        headers: [],
      },
      response: {
        status: 200,
        statusText: 'OK',
        headers: [],
        content: {
          text: 'SGVsbG8gV29ybGQ=', // "Hello World" in base64
          mimeType: 'text/plain',
          encoding: 'base64',
        },
      },
    };

    const formatted = formatHar(har as HarEntry);

    expect(formatted.response.content.text).toBe('Hello World');
    expect(formatted.response.content.encoding).toBe('utf-8');
  });

  it('should handle entries without encoding', () => {
    const har: DeepPartial<HarEntry> = {
      request: {
        url: 'https://api.example.com/v1/users',
        method: 'get',
        headers: [],
      },
      response: {
        status: 200,
        statusText: 'OK',
        headers: [],
        content: {
          text: 'plain text',
          mimeType: 'text/plain',
        },
      },
    };

    const formatted = formatHar(har as HarEntry);

    expect(formatted.response.content.text).toBe('plain text');
  });

  it('should handle entries without response text', () => {
    const har: DeepPartial<HarEntry> = {
      request: {
        url: 'https://api.example.com/v1/users',
        method: 'get',
        headers: [],
      },
      response: {
        status: 204,
        statusText: 'No Content',
        headers: [],
        content: {
          mimeType: 'text/plain',
          encoding: 'base64',
        },
      },
    };

    const formatted = formatHar(har as HarEntry);

    expect(formatted.response.content.text).toBeUndefined();
  });

  it('should decode the url', () => {
    const testStr = 'https://example.com/&;.?$%-+§/`';
    const har: DeepPartial<HarEntry> = {
      request: {
        url: encodeURIComponent(testStr),
        method: 'get',
      },
      response: {
        status: 204,
        content: {
        },
      },
    };

    const formatted = formatHar(har as HarEntry);

    expect(formatted.request.url).toBe(testStr);
  });
});