const { parseMeta, mergeQuery, toBasePath } = require('../utils');

describe('parseMeta', () => {
  test('Parse a single meta string', () => {
    const metaString = 'codesandbox=react';

    expect(parseMeta(metaString)).toEqual({
      codesandbox: 'react',
    });
  });

  test('Parse multiple meta strings', () => {
    const metaString = 'codesandbox=react file=./template';

    expect(parseMeta(metaString)).toEqual({
      codesandbox: 'react',
      file: './template',
    });
  });

  test('Parse meta string with equal sign in it', () => {
    const metaString = 'codesandbox=react?module=src/App.js file=./template';

    expect(parseMeta(metaString)).toEqual({
      codesandbox: 'react?module=src/App.js',
      file: './template',
    });
  });
});

describe('mergeQuery', () => {
  test('Merge two URLSearchParams', () => {
    const baseQuery = new URLSearchParams({
      foo: 'bar',
      taiwan: 'number 1',
    });

    const query1 = new URLSearchParams({
      foo: 87,
      code: 'sandbox',
    });

    expect(mergeQuery(baseQuery, query1)).toEqual(
      new URLSearchParams({
        foo: 87,
        taiwan: 'number 1',
        code: 'sandbox',
      })
    );
  });

  test('Merge with different types of queries', () => {
    const baseQuery = new URLSearchParams({
      foo: 'bar',
      taiwan: 'number 1',
    });

    const query1 = {
      foo: 87,
      code: 'sandbox',
    };

    const query2 = undefined;

    expect(mergeQuery(baseQuery, query1, query2)).toEqual(
      new URLSearchParams({
        foo: 87,
        taiwan: 'number 1',
        code: 'sandbox',
      })
    );
  });
});

describe('toBasePath', () => {
  test('Base path return as-is', () => {
    const path = 'src/index.js';

    expect(toBasePath(path)).toBe('src/index.js');
  });

  test('Path starts with dot slash', () => {
    const path = './src/index.js';

    expect(toBasePath(path)).toBe('src/index.js');
  });

  test('Path starts with slash', () => {
    const path = '/src/index.js';

    expect(toBasePath(path)).toBe('src/index.js');
  });
});
