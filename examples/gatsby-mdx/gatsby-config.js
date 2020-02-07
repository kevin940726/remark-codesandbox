const path = require('path');

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: require.resolve('gatsby-remark-codesandbox'),
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
  ],
};
