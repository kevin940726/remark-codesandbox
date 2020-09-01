# remark-codesandbox

🎩 A [remark](https://remark.js.org/) plugin to create [CodeSandbox](https://codesandbox.io/) directly from code blocks

[![npm version](https://badge.fury.io/js/remark-codesandbox.svg)](https://badge.fury.io/js/remark-codesandbox)

<img src="demo.png" alt="Demo transformation" width="400" />

**Try it online on CodeSandbox!** (Yep, we're demoing CodeSandbox inside CodeSandbox, why not!?)

[![Edit remark-codesandbox demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/kevin940726/remark-codesandbox/tree/master/fixtures/demo?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.md&theme=dark)

## Features

- [x] 🔗 Directly create CodeSandbox urls from code blocks
- [x] ✨ Support 3 different _modes_: **meta**, **iframe**, and **button**
- [x] 🚀 Don't need to create additional folders or `package.json` file
- [x] 🎉 Support [MDX](https://mdxjs.com/), [Gatsby](https://www.gatsbyjs.org/), [Storybook Docs](https://storybook.js.org/docs/basics/introduction/), [docz](https://www.docz.site/), etc...
- [x] 📦 Support bringing your own custom templates, even directly from the same repository!
- [x] ⚡ One line setup, highly customizable
- [x] 💪 Great for library authors to demonstrate usages directly from documentation!

## Examples

- [**`reaviz`**](https://reaviz.io/?path=/docs/docs-chart-types-area-chart--page) documentation is built with [Storybook docs](https://github.com/storybookjs/storybook/tree/master/addons/docs#manual-configuration) and `remark-codesandbox`.
- The [**test cases**](https://github.com/kevin940726/remark-codesandbox/blob/master/packages/remark-codesandbox/test.js) of this project.

## Installation

```bash
yarn add -D remark-codesandbox
```

Install the Gatsby version instead if you're using Gatsby.

```bash
yarn add gatsby-remark-inline-codesandbox
```

## Getting Started

Import `remark-codesandbox` to your remark plugins. (Skip this step if you're using Gatsby)

```js
const codesandbox = require('remark-codesandbox');
```

[**remark**](https://github.com/remarkjs/remark/blob/master/doc/plugins.md#using-plugins)

```js
remark().use(codesandbox, { mode: 'button' });
```

[**MDX**](https://mdxjs.com/advanced/plugins#using-remark-and-rehype-plugins)

```js
mdx(mdxCode, {
  remarkPlugins: [[codesandbox, { mode: 'button' }]],
});
```

[**Gatsby (gatsby-plugin-mdx)**](https://www.gatsbyjs.org/docs/mdx/plugins/#remark-plugins)

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-inline-codesandbox',
            options: {
              mode: 'button',
            },
          },
        ],
      },
    },
  ],
};
```

[**Gatsby (gatsby-transformer-remark)**](https://www.gatsbyjs.org/packages/gatsby-transformer-remark)

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-inline-codesandbox',
            options: {
              mode: 'button',
            },
          },
        ],
      },
    },
  ],
};
```

[**Storybook docs**](https://github.com/storybookjs/storybook/tree/master/addons/docs#manual-configuration)

```js
config.module.rules.push({
  test: /\.(stories|story)\.mdx$/,
  use: [
    {
      loader: '@mdx-js/loader',
      options: {
        compilers: [createCompiler({})],
        remarkPlugins: [[codesandbox, { mode: 'button' }]],
      },
    },
  ],
});
```

## Usage

Add a special _meta tag_ to your code blocks.

````md
```js codesandbox=react
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello remark-codesandbox!</h1>,
  document.getElementById('root')
);
```
````

And..., that's it!

The above example with `mode` being set to `button` will append a CodeSandbox button after the code block. Clicking on it will open the generated sandbox. How cool is that!

There are also other **modes** and additional configurations, follow the [documentation](#documentation) below for more information.

## Documentation

### Markdown Syntax

Append `codesandbox` meta to code blocks to enable `remark-codesandbox`. The value here is the `id` of the sandbox.

````md
```js codesandbox=new
// ...
```
````

There are a set of default official sandbox templates, you can find the list [here](https://codesandbox.io/api/v1/sandboxes/templates/official). Some examples are [`new`(react)](https://codesandbox.io/s/new), [`vanilla`(parcel)](https://codesandbox.io/s/vanilla), [`vue`](https://codesandbox.io/s/vue), [`static`](https://codesandbox.io/s/static)...

The content of the code block will replace the **entry file** entirely. So for the `new` template, the content will replace the `src/index.js` file entirely. Be sure to import the necessary packages for the templates to work.

There are also some default **alias** provided by the plugin. `react` is an alias to `new`. `react-component` is also an alias to `new` but changing the entry to `src/App.js`. So that you can just export a react component in the code block.

````md
```js codesandbox=react-component
import React from 'react';

export default function App() {
  return <h1>Hello remark-codesandbox!</h1>;
}
```
````

It's also possible to use any existing sandbox. Just get the `id` of the sandbox from the url. The `id` is usually the last ~5 random characters of the sandbox url. Sandbox imported from Github is also supported, the `id` is usually the sub-domain of the sandbox preview url (~10 random characters).

````md
```js codesandbox=mqpp1d4r0
// ...
```
````

It's also possible to customize the url by appending _query parameters_. Just append them after the sandbox id. All [options](https://codesandbox.io/docs/embedding#embed-options) are allowed.

````md
```js codesandbox=new?codemirror=1&fontsize=12
// ...
```
````

Want to use custom templates and keep them version controlled in the same repository? Use `file:` schema to load templates directly from the file system! The below code will load the template from the path `./templates/vanilla-console`, relative to the markdown file. The file templates are directories with at least a `package.json` file inside.

As in the other examples, the content of the code block will replace the entry file in the template.

````md
```js codesandbox=file:./templates/vanilla-console
console.log('this code will replace the entry file content');
```
````

If you would like to use the template as-is without any of the content of the code block, add the `?overrideEntry=false` query string:

````md
```js codesandbox=file:./templates/vanilla-console?overrideEntry=false
// This code will not be added to the sandbox
```
````

This `?overrideEntry=false` will not be set as a query parameter on the sandbox, since it is only important for the plugin itself.

The path is too long to type every time? Consider creating it as a [custom template](#customTemplates). It's also the recommended way!

> Pro tip: You can create file templates directly on [codesandbox.io/s](https://codesandbox.io/s) and download them by selecting `File` -> `Export to ZIP` in the menu bar. Unzip it somewhere and... Abrahadabra! You got yourself a file template!

### Options

The plugin accepts a set of options with the following default values:

```ts
{
  remarkPlugins: [
    codesandbox,
    {
      // Can be one of `meta`, `iframe`, or `button`
      mode: 'meta',
      // The query here will be appended to the generated url for every sandbox. Can be `string`, `object`, `URLSearchParams` instance, or `undefined`
      query:
        mode === 'iframe'
          ? {
              fontsize: '14px',
              hidenavigation: 1,
              theme: 'dark',
            }
          : undefined,
      // Define custom templates or override existing ones
      customTemplates: {},
      // Whether to automatically deploy code blocks via CodeSandbox API
      autoDeploy: false,
    },
  ];
}
```

### `mode`

- `meta`: Generate the CodeSandbox url and store them in the AST. By itself this mode won't have any visual change to the markdown, it's useful for other plugins or users to kick in and do whatever they like with the sandbox url. The url will be stored in `node.data.codesandboxUrl` and `node.data.hProperties.dataCodesandboxUrl`. One example usage would be to customize the CodeSandbox button in the UI.
- `iframe`: This mode will replace the code block entirely with the generated sandbox iframe tag. The iframe comes with some default query params, but you can override them via `iframeQuery`.
- `button`: This mode will keep the code block as is, and append a **CodeSandbox button** like the one below immediately after the code block.

  [![Edit React](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-new?fontsize=14&hidenavigation=1&theme=dark)

### `query`

By default there will be no query except for the `module` key appended to the generated url. You can customize query in every url here. However, when the `mode` is `iframe`, there will be a set of custom queries predefined below.

```js
query =
  mode === 'iframe'
    ? {
        fontsize: '14px',
        hidenavigation: 1,
        theme: 'dark',
      }
    : undefined;
```

You can override them by passing `query` to the options. Note that the object passed will **replace** the default object, be sure to include the default query again if you want to keep them.

### `customTemplates`

Define custom templates to use in the code blocks. Expect an object with the key being the template ID and the value is the template info.

The template info is an object with the interface below.

```js
interface TemplateInfo {
  extends: string;
  entry?: string;
  query?: string | { [key: string]: string } | URLSearchParams;
  files?: { [filePath: string]: { content: string | Object } };
}
```

- `extends`: To make defining custom templates easier, the plugin accepts a `extends` key to let you extend any existing template. The value can be any CodeSandbox id, or a `file:` path, or any other custom template id. If using `file:` paths, it's recommended to use absolute paths. Relative paths are relative to `process.cwd()` by default, in contrast to relative paths defining inline in the code blocks.
- `entry`: The entry file to show in the template, it's also the file where the code block will replace to. Allowing users to use the same template/sandbox with a different file to override.
- `query`: The query params to be appended to the generated url. It will _merge_ and override and key in the [`options.query`](#query) above. However, it will be merged and overridden by the query defining inline in the code block meta.
- `files`: Additional files to merge and override the existing ones. The signature follows the [official API](https://codesandbox.io/docs/importing#how-it-works). It's recommended to use the `file:` path in `extends` field whenever possible as it's easier to manage and version control.

Below is the default custom templates.

```js
{
  // Alias `react` to `new`
  react: {
    extends: 'new',
  },
  // Alias `react-component` to `new`, but also override `entry` to `src/App.js`
  'react-component': {
    extends: 'new',
    entry: 'src/App.js',
  },
}
```

### `autoDeploy`

By default, the url is generated locally without calling the [official API](https://codesandbox.io/docs/importing#define-api). The API would only be called when the user clicks the button or views the iframe. This is done by manually construct the `parameters` locally, and compress them via `lz-string`. Note that there is a [general guideline](https://stackoverflow.com/a/417184/4699228) to keep urls under 2000 characters, longer urls might not work in some browsers.

You can bypass this by passing `true` to `autoDeploy`. Results in a much shorter url with an unique `codesandbox_id` in the url. The drawback is that it takes more time to generate the url.

A common practice would be to only set it to `true` in production (or when the result urls are too long for the browsers you support), while keeping it `false` when developing for faster reload time.

```js
{
  autoDeploy: process.env.NODE_ENV === 'production';
}
```

## Contributing

Run `git clone` and `cd`.

```bash
yarn # Install dependencies

yarn test # Run tests

yarn example # Run build on all examples

yarn bump [patch|minor|major] # Bump version of remark-codesandbox

yarn release # Publish remark-codesandbox to npm
```

## License

MIT
