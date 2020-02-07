import React from 'react';
import { graphql } from 'gatsby';

export default function Template({
  data: {
    markdownRemark: { html },
  },
}) {
  return <article dangerouslySetInnerHTML={{ __html: html }} />;
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
      }
    }
  }
`;
