expect.extend({
  toMatchString(received, strings, ...patterns) {
    let actual = received;
    let pass = true;

    const linesSeparatedFirstString = strings[0].split('\n');
    const firstQuoteIndex = strings[0].indexOf('"');
    const lastQuoteIndex = strings[strings.length - 1].lastIndexOf('"');
    const lineCharacterBeforeFirstQuoteIndex = strings[0]
      .slice(0, firstQuoteIndex)
      .lastIndexOf('\n');
    const indentedSpaces =
      firstQuoteIndex - lineCharacterBeforeFirstQuoteIndex - 1;

    const dedentedStrings = strings.map((string, i) => {
      let str = string;
      if (i === 0) {
        str = str.slice(firstQuoteIndex + 1);
      } else if (i === strings.length - 1) {
        str = str.slice(0, lastQuoteIndex);
      }

      return str
        .split('\n')
        .map((line, j) => (j === 0 ? line : line.slice(indentedSpaces)))
        .join('\n');
    });

    for (let i = 0; i < dedentedStrings.length; i += 1) {
      if (!actual.startsWith(dedentedStrings[i])) {
        pass = false;
        break;
      }
      actual = actual.slice(dedentedStrings[i].length);

      if (i !== dedentedStrings.length - 1) {
        const match = patterns[i].exec(actual);

        if (!match || match.index !== 0) {
          pass = false;
          break;
        }
        actual = actual.slice(match[0].length);
      }
    }

    if (actual !== '') {
      pass = false;
    }

    let stringWithPattern = [];
    for (let i = 0; i < dedentedStrings.length; i += 1) {
      stringWithPattern.push(dedentedStrings[i]);

      if (i !== dedentedStrings.length - 1) {
        stringWithPattern.push(patterns[i]);
      }
    }
    stringWithPattern = stringWithPattern.join('');

    return pass
      ? {
          message: () =>
            `expected "${received}" not to match the string with patterns "${stringWithPattern}"`,
          pass,
        }
      : {
          message: () =>
            `expected "${received}" to match the string with patterns "${stringWithPattern}"`,
          pass,
        };
  },
});
