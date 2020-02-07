const codesandbox = require('remark-codesandbox');
const path = require('path');

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: require.resolve('remark-codesandbox/gatsby'),
            options: {
              mode: 'button',
              customTemplates: {
                'vanilla-console': {
                  extends: `file:${path.resolve('./src/vanilla-template/')}`,
                  entry: 'src/index.js',
                  query: {
                    previewwindow: 'console',
                  },
                },
              },
            },
          },
        ],
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
