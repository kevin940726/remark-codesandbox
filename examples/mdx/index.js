const fs = require('fs').promises;
const path = require('path');
const babel = require('@babel/core');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const mdx = require('@mdx-js/mdx');
const { MDXProvider, mdx: createElement } = require('@mdx-js/react');
const prettier = require('prettier');

const codesandbox = require('remark-codesandbox');

const transform = code =>
  babel.transform(code, {
    plugins: [
      '@babel/plugin-transform-react-jsx',
      '@babel/plugin-proposal-object-rest-spread',
    ],
  }).code;

const renderWithReact = async mdxCode => {
  const jsx = await mdx(mdxCode, {
    skipExport: true,
    remarkPlugins: [[codesandbox, { mode: 'meta' }]],
  });
  const code = transform(jsx);

  const element = new Function(
    'React',
    'mdx',
    `${code}; return React.createElement(MDXContent)`
  )(React, createElement);

  const elementWithProvider = React.createElement(MDXProvider, null, element);

  return renderToStaticMarkup(elementWithProvider);
};

fs.readFile(path.resolve(__dirname, 'index.mdx'))
  .then(renderWithReact)
  .then(html => prettier.format(html, { parser: 'html' }))
  .then(fs.writeFile.bind(null, path.resolve(__dirname, 'index.html')));
