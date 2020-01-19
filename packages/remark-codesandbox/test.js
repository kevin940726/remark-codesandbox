/**
 * These tests actually don't make any mock calls,
 * they calls the official APIs like in e2e testing.
 * They might occasionally fail due to network issues.
 */
const remark = require('remark');
const dedent = require('dedent');
const codesandbox = require('./');

describe('default mode: meta', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox);
  });

  test('simple markdown', async () => {
    const md = dedent`
      The below code block will have a codesandbox-url meta.

      \`\`\`jsx codesandbox=react
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(md);

    expect(contents).toBe(md);
  });

  test('skip codesandbox', async () => {
    const md = dedent`
      The below code block will not create corresponding codesandbox.

      \`\`\`jsx
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(md);

    expect(contents).toBe(md);
  });
});

describe('mode: button', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, { mode: 'button' });
  });

  test('simple markdown', async () => {
    const md = dedent`
      The below code block will have a **Edit on CodeSandbox** button below it.

      \`\`\`jsx codesandbox=react
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(md);

    expect(contents.slice(0, md.length)).toBe(md);
    expect(contents.slice(md.length + 1)).toMatchInlineSnapshot(`
      "[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/sdy9z?module=%2Fsrc%2Findex.js)
      "
    `);
  });

  test('multiple code blocks', async () => {
    const md = dedent`
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
      \`\`\`\n
    `;

    const { contents } = await processor.process(md);

    expect(contents).toMatchInlineSnapshot(`
      "The below code block will have a **Edit on CodeSandbox** button.

      \`\`\`jsx codesandbox=react
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`

      [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/sdy9z?module=%2Fsrc%2Findex.js)

      This one will render React component custom template

      \`\`\`jsx codesandbox=react-component
      import React from 'react';

      export default function App() {
        return <h1>Hello remark-codesandbox!</h1>;
      }
      \`\`\`

      [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fc0vt?module=%2Fsrc%2FApp.js)
      "
    `);
  });
});

describe('mode: iframe', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, { mode: 'iframe' });
  });

  test('simple markdown', async () => {
    const md = dedent`
      The below code block will be replaced with an iFrame of embedded CodeSandbox.

      \`\`\`jsx codesandbox=react
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(md);

    expect(contents).toMatchInlineSnapshot(`
      "The below code block will be replaced with an iFrame of embedded CodeSandbox.

      <iframe
        src=\\"https://codesandbox.io/embed/sdy9z?fontsize=14px&hidenavigation=1&theme=dark&module=%2Fsrc%2Findex.js\\"
        style=\\"width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;\\"
        title=\\"React\\"
        allow=\\"geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb\\"
        sandbox=\\"allow-modals allow-forms allow-popups allow-scripts allow-same-origin\\"
      ></iframe>
      "
    `);
  });

  test('with title', async () => {
    const md = dedent`
      # remark-codesandbox example

      The below code block will be replaced with an iFrame of embedded CodeSandbox.

      \`\`\`jsx codesandbox=react
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(md);

    expect(contents).toMatchInlineSnapshot(`
      "# remark-codesandbox example

      The below code block will be replaced with an iFrame of embedded CodeSandbox.

      <iframe
        src=\\"https://codesandbox.io/embed/sdy9z?fontsize=14px&hidenavigation=1&theme=dark&module=%2Fsrc%2Findex.js\\"
        style=\\"width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;\\"
        title=\\"remark-codesandbox example\\"
        allow=\\"geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb\\"
        sandbox=\\"allow-modals allow-forms allow-popups allow-scripts allow-same-origin\\"
      ></iframe>
      "
    `);
  });
});

describe('custom templates', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, {
      mode: 'iframe',
      customTemplates: {
        'react-style': {
          extends: 'new',
          entry: '/src/styles.css',
        },
      },
    });
  });

  test('override entry', async () => {
    const md = dedent`
      The below code block will create codesandbox based on custom template.

      \`\`\`css codesandbox=react-style
      .App {
        font-family: sans-serif;
        text-align: center;
        color: red;
      }
      \`\`\`\n
    `;

    const { contents } = await processor.process(md);

    expect(contents).toMatchInlineSnapshot(`
      "The below code block will create codesandbox based on custom template.

      <iframe
        src=\\"https://codesandbox.io/embed/vi9bn?fontsize=14px&hidenavigation=1&theme=dark&module=%2Fsrc%2Fstyles.css\\"
        style=\\"width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;\\"
        title=\\"React\\"
        allow=\\"geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb\\"
        sandbox=\\"allow-modals allow-forms allow-popups allow-scripts allow-same-origin\\"
      ></iframe>
      "
    `);
  });
});

describe('iframe query', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, {
      mode: 'iframe',
      iframeQuery: {
        fontsize: 12,
        hidenavigation: 0,
      },
    });
  });

  test('with inline override', async () => {
    const md = dedent`
      The below code block will create codesandbox and inject custom iframe query.

      \`\`\`css codesandbox=react?fontsize=13
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(md);

    expect(contents).toMatchInlineSnapshot(`
      "The below code block will create codesandbox and inject custom iframe query.

      <iframe
        src=\\"https://codesandbox.io/embed/sdy9z?fontsize=13&hidenavigation=0&module=%2Fsrc%2Findex.js\\"
        style=\\"width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;\\"
        title=\\"React\\"
        allow=\\"geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb\\"
        sandbox=\\"allow-modals allow-forms allow-popups allow-scripts allow-same-origin\\"
      ></iframe>
      "
    `);
  });
});
