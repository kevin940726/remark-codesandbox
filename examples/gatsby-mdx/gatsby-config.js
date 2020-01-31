const codesandbox = require('remark-codesandbox');

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        remarkPlugins: [[codesandbox, { mode: 'button' }]],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
  ],
};
