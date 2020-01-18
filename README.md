# remark-codesandbox

🎩 Create CodeSandbox directly from code blocks

## Features

- [x] 🔗 Directly create CodeSandbox urls from code blocks
- [x] ✨ Support 3 different _modes_: **meta**, **iframe**, and **button**
- [x] 🚀 Don't need to create additional folders or `package.json` file
- [x] 🎉 Support [MDX](https://mdxjs.com/), [Gatsby](https://www.gatsbyjs.org/), [Storybook Docs](https://storybook.js.org/docs/basics/introduction/), [docz](https://www.docz.site/), etc...
- [x] 📦 Support bringing your own custom templates
- [x] ⚡ One line setup, highly customizable

## Installation

```bash
yarn add remark-codesandbox
```

## Getting Started

Import `remark-codesandbox` to your remark plugins.

```js
mdx(mdxCode, {
  remarkPlugins: [[codesandbox, { mode: 'button' }]],
});
```

Then add a special _meta tag_ to your code blocks.

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

The above example will append a CodeSandbox button after the code block. Clicking on it will open the generated sandbox. How cool is that!

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

### Options

The plugin accepts a set of options with the following default values:

```js
{
  remarkPlugins: [
    codesandbox,
    {
      // Can be one of `meta`, `iframe`, or `button`
      mode: 'meta',
      // When using iframe mode, the query here will be appended to the generated iframe url
      iframeQuery: undefined,
      // Define custom templates or override existing ones
      customTemplates: {},
    },
  ];
}
```

### `mode`

- `meta`: Generate the CodeSandbox url and store them in the AST. By itself this mode won't have any visual change to the markdown, it's useful for other plugins or users to kick in and do whatever they like with the sandbox url. The url will be stored in `node.data.codesandboxUrl` and `node.data.hProperties.dataCodesandboxUrl`. One example usage would be to customize the CodeSandbox button in the UI.
- `iframe`: This mode will replace the code block entirely with the generated sandbox iframe tag. The iframe comes with some default query params, but you can override them via `iframeQuery`.
- `button`: This mode will keep the code block as is, and append a **CodeSandbox button** like the one below immediately after the code block.

  [![Edit React](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-new?fontsize=14&hidenavigation=1&theme=dark)

### `iframeQuery`

By default the iframe will be appended by the default query params below:

```js
{
  fontsize: '14px',
  hidenavigation: 1,
  theme: 'dark',
}
```

You can override them by passing `iframeQuery` to the options. Note that the object passed will **replace** the default object, be sure to include the default query again if you want to keep them.

### `customTemplates`

Define custom templates to use in the code blocks. Expect an object with the key being the template ID and the value is the template info.

The template info is an object representing the template from the [official API](https://codesandbox.io/api/v1/sandboxes/new). To make defining custom templates easier, the plugin accepts an additional key `extends` to let you extend any existing template. Below is the default custom templates.

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

Not only official templates you can extend from, but also any custom sandbox.

```js
{
  // Alias `redux-todomvc` to the custom sandbox imported from Github
  'redux-todomvc': {
    extends: 'mqpp1d4r0'
  }
}
```

It's recommended to create your own CodeSandbox from the UI and alias it to a custom readable name here. Remember to **freeze** it to prevent accidental changes.

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
