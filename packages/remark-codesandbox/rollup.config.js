const path = require('path');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/remark-codesandbox.js',
    sourcemap: true,
    format: 'cjs',
  },
  external: Object.keys(pkg.dependencies)
    .concat(['path', 'url'])
    .concat(['codesandbox/lib/api/define']),
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs({
      ignore: id => path.basename(id) === 'fsTemplate' || id === 'url',
    }),
    babel({
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            loose: true,
            exclude: ['transform-async-to-generator', 'transform-regenerator'],
          },
        ],
      ],
      plugins: [
        [
          require.resolve('babel-plugin-transform-async-to-promises'),
          {
            inlineHelpers: true,
          },
        ],
      ],
    }),
    replace({
      'typeof window': JSON.stringify('object'),
      delimiters: ['', ''],
    }),
    terser({
      sourcemap: true,
      compress: {
        pure_getters: true,
        passes: 10,
      },
      output: {
        // By default, Terser wraps function arguments in extra parens to trigger eager parsing.
        // Whether this is a good idea is way too specific to guess, so we optimize for size by default:
        wrap_func_args: false,
      },
      warnings: true,
      ecma: 5,
      toplevel: true,
    }),
  ],
};
