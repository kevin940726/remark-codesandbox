const escapeStringRegexp = require('escape-string-regexp');
const dedent = require('dedent');

function dedentStrings(strings) {
  const PATTERN_TOKEN = '__PATTERN_TOKEN__';

  const stringWithPatterns = strings.join(PATTERN_TOKEN);
  const dedentedString = dedent(stringWithPatterns);
  const dedentedStringWithoutQuotes = dedentedString.slice(1, -1);

  const dedentedStrings = dedentedStringWithoutQuotes.split(PATTERN_TOKEN);

  return dedentedStrings;
}

expect.extend({
  toMatchStringWithPatterns(received, strings, ...patterns) {
    const dedentedStrings = dedentStrings(strings);

    let regexpString = '';
    dedentedStrings.forEach((string, index) => {
      regexpString += escapeStringRegexp(string);

      if (patterns[index]) {
        regexpString += patterns[index].source;
      }
    });

    regexpString = '^' + regexpString + '$';

    const regex = new RegExp(regexpString);

    const pass = regex.test(received);

    return {
      pass,
      message: () =>
        `expected the output to ${
          pass ? 'not ' : ''
        }match the string with patterns`,
    };
  },
});
