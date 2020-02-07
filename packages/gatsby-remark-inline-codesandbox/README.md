# gatsby-remark-inline-codesandbox

## Installation

```bash
yarn add gatsby-remark-inline-codesandbox
```

## Setup

[`gatsby-plugin-mdx`](https://www.gatsbyjs.org/docs/mdx/plugins/#remark-plugins)

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

[`gatsby-transformer-remark`](https://www.gatsbyjs.org/packages/gatsby-transformer-remark)

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

## Usage & Documentation

See the [`remark-codesandbox`](https://github.com/kevin940726/remark-codesandbox) package for more information.
