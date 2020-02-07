const vfile = require('to-vfile');
const codesandbox = require('remark-codesandbox');

module.exports = ({ markdownAST, markdownNode }, options) => {
  const file = vfile(markdownNode.fileAbsolutePath);

  return codesandbox(options)(markdownAST, file);
};
