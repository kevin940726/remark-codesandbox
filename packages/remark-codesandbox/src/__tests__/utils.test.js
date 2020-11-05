const { parseMeta, mergeQuery, toBasePath, mergeStyle } = require('../utils');

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

describe('mergeStyle', () => {
  test('Merge with base style', () => {
    const baseStyle =
      'width:100%; height:500px; border:0; border-radius:4px; overflow:hidden;';
    const style = 'height: 1000px';

    const mergedStyle = mergeStyle(baseStyle, style);

    expect(mergedStyle).toBe(
      'width:100%; height:1000px; border:0; border-radius:4px; overflow:hidden;'
    );
  });

  test('Merge with empty style', () => {
    const baseStyle =
      'width:100%; height:500px; border:0; border-radius:4px; overflow:hidden;';
    const style = '';

    const mergedStyle = mergeStyle(baseStyle, style);

    expect(mergedStyle).toBe(baseStyle);
  });

  test('Merge with multiple styles', () => {
    const baseStyle =
      'width:100%; height:500px; border:0; border-radius:4px; overflow:hidden;';
    const style =
      'height: 1000px; width: 600px; height: 1200px ;border-radius:  0 ';

    const mergedStyle = mergeStyle(baseStyle, style);

    expect(mergedStyle).toBe(
      'width:600px; height:1200px; border:0; border-radius:0; overflow:hidden;'
    );
  });
});
