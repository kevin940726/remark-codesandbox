const Remark = require('remark');
const codesandbox = require('./');

const remark = new Remark();

test('simple markdown file with mode meta', async () => {
  const md = `
The below code block will have a codesandbox-url meta.

\`\`\`jsx codesandbox=react
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello remark-codesandbox!</h1>,
  document.getElementById('root')
);
\`\`\`
  `;

  const tree = remark.parse(md);

  await codesandbox()(tree);

  expect(remark.stringify(tree)).toMatchInlineSnapshot(`
    "The below code block will have a codesandbox-url meta.

    \`\`\`jsx codesandbox=react
    import React from 'react';
    import ReactDOM from 'react-dom';

    ReactDOM.render(
      <h1>Hello remark-codesandbox!</h1>,
      document.getElementById('root')
    );
    \`\`\`
    "
  `);
});

test('mode button', async () => {
  const md = `
The below code block will have a **Edit on CodeSandbox** button below it.

\`\`\`jsx codesandbox=react
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello remark-codesandbox!</h1>,
  document.getElementById('root')
);
\`\`\`
  `;

  const tree = remark.parse(md);

  await codesandbox({ mode: 'button' })(tree);

  expect(remark.stringify(tree)).toMatchInlineSnapshot(`
    "The below code block will have a **Edit on CodeSandbox** button below it.

    \`\`\`jsx codesandbox=react
    import React from 'react';
    import ReactDOM from 'react-dom';

    ReactDOM.render(
      <h1>Hello remark-codesandbox!</h1>,
      document.getElementById('root')
    );
    \`\`\`

    [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/sdy9z?module=src%2Findex.js)
    "
  `);
});

test('mode iframe', async () => {
  const md = `
The below code block will be replaced with an iFrame of embedded CodeSandbox.

\`\`\`jsx codesandbox=react
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello remark-codesandbox!</h1>,
  document.getElementById('root')
);
\`\`\`
  `;

  const tree = remark.parse(md);

  await codesandbox({ mode: 'iframe' })(tree);

  expect(remark.stringify(tree)).toMatchInlineSnapshot(`
    "The below code block will be replaced with an iFrame of embedded CodeSandbox.

    <iframe
      src=\\"https://codesandbox.io/embed/sdy9z?fontsize=14px&hidenavigation=1&theme=dark&module=src%2Findex.js\\"
      style=\\"width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;\\"
      title=\\"React\\"
      allow=\\"geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb\\"
      sandbox=\\"allow-modals allow-forms allow-popups allow-scripts allow-same-origin\\"
    ></iframe>
    "
  `);
});

test('multiple code blocks', async () => {
  const md = `
The below code block will have a **Edit on CodeSandbox** button.

\`\`\`jsx codesandbox=react
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello remark-codesandbox!</h1>,
  document.getElementById('root')
);
\`\`\`

This one will render React component custom template

\`\`\`jsx codesandbox=react-component
import React from 'react';

export default function App() {
  return <h1>Hello remark-codesandbox!</h1>;
}
\`\`\`
  `;

  const tree = remark.parse(md);

  await codesandbox({ mode: 'button' })(tree);

  expect(remark.stringify(tree)).toMatchInlineSnapshot(`
    "The below code block will have a **Edit on CodeSandbox** button.

    \`\`\`jsx codesandbox=react
    import React from 'react';
    import ReactDOM from 'react-dom';

    ReactDOM.render(
      <h1>Hello remark-codesandbox!</h1>,
      document.getElementById('root')
    );
    \`\`\`

    [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/sdy9z?module=src%2Findex.js)

    This one will render React component custom template

    \`\`\`jsx codesandbox=react-component
    import React from 'react';

    export default function App() {
      return <h1>Hello remark-codesandbox!</h1>;
    }
    \`\`\`

    [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fc0vt?module=src%2FApp.js)
    "
  `);
});

test('with title', async () => {
  const md = `
# remark-codesandbox example 

The below code block will be replaced with an iFrame of embedded CodeSandbox.

\`\`\`jsx codesandbox=react
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello remark-codesandbox!</h1>,
  document.getElementById('root')
);
\`\`\`
  `;

  const tree = remark.parse(md);

  await codesandbox({ mode: 'iframe' })(tree);

  expect(remark.stringify(tree)).toMatchInlineSnapshot(`
    "# remark-codesandbox example

    The below code block will be replaced with an iFrame of embedded CodeSandbox.

    <iframe
      src=\\"https://codesandbox.io/embed/sdy9z?fontsize=14px&hidenavigation=1&theme=dark&module=src%2Findex.js\\"
      style=\\"width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;\\"
      title=\\"remark-codesandbox example\\"
      allow=\\"geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb\\"
      sandbox=\\"allow-modals allow-forms allow-popups allow-scripts allow-same-origin\\"
    ></iframe>
    "
  `);
});
