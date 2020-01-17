const codesandbox = require('./');

module.exports = ({ markdownAST }, config) => codesandbox(config)(markdownAST);
