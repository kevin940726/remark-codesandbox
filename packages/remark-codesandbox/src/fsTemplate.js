const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = require('recursive-readdir');
// un-documented APIs, we lock the version in package.json to prevent breaks
const {
  getMainFile,
  getTemplate,
} = require('codesandbox-import-utils/lib/create-sandbox/templates');

const readFile = promisify(fs.readFile);

async function fsTemplate(directoryPath, file) {
  if (!file) {
    throw new Error(
      'No file object provided, are you running on a non-remark environment?'
    );
  }

  const absDirectoryPath = path.isAbsolute(directoryPath)
    ? directoryPath
    : path.resolve(path.dirname(file.path), directoryPath);

  const filePaths = await readdir(absDirectoryPath, [
    '.gitignore',
    '*.log',
    '.DS_Store',
    'node_modules',
    'package-lock.json',
    'yarn.lock',
  ]);

  const files = {};

  for (const filePath of filePaths) {
    const relativePath = path.relative(absDirectoryPath, filePath);

    files[relativePath] = {
      content: await readFile(filePath, 'utf8'),
    };
  }

  if (!files['package.json']) {
    throw new Error(
      'No "package.json" found, it\'s required to be used with file templates.'
    );
  }

  const packageJSON = JSON.parse(files['package.json'].content);

  const templateName = getTemplate(packageJSON, files);
  const entry = getMainFile(templateName);

  return {
    files,
    entry,
    title: path.basename(absDirectoryPath),
  };
}

module.exports = fsTemplate;
