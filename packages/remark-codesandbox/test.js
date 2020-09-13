/**
 * These tests actually don't make any mock calls,
 * they call the official APIs like in e2e testing.
 * They might occasionally fail due to network issues or when API changed upstream.
 */
const remark = require('remark');
const dedent = require('dedent');
const path = require('path');
const codesandbox = require('./');

const SANDBOX_ID_PATTERN = /[a-zA-Z0-9]{5}/;
const PARAMETER_PATTERN = /[a-zA-Z0-9-_]+/;

function createFile(contents) {
  return {
    contents,
    path: path.resolve(__dirname, 'README.md'),
    dirname: __dirname,
  };
}

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

    const { contents } = await processor.process(createFile(md));

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

    const { contents } = await processor.process(createFile(md));

    expect(contents).toBe(md);
  });
});

describe('mode: button', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, { mode: 'button', autoDeploy: true });
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

    const { contents } = await processor.process(createFile(md));

    expect(contents.slice(0, md.length)).toBe(md);
    expect(contents.slice(md.length + 1)).toMatchStringWithPatterns`
      "[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/${SANDBOX_ID_PATTERN}?module=%2Fsrc%2Findex.js)
      "
    `;
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

    const { contents } = await processor.process(createFile(md));

    expect(contents).toMatchStringWithPatterns`
      "The below code block will have a **Edit on CodeSandbox** button.

      \`\`\`jsx codesandbox=react
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`

      [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/${SANDBOX_ID_PATTERN}?module=%2Fsrc%2Findex.js)

      This one will render React component custom template

      \`\`\`jsx codesandbox=react-component
      import React from 'react';

      export default function App() {
        return <h1>Hello remark-codesandbox!</h1>;
      }
      \`\`\`

      [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/${SANDBOX_ID_PATTERN}?module=%2Fsrc%2FApp.js)
      "
    `;
  });
});

describe('mode: iframe', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, { mode: 'iframe', autoDeploy: true });
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

    const { contents } = await processor.process(createFile(md));

    expect(contents).toMatchStringWithPatterns`
      "The below code block will be replaced with an iFrame of embedded CodeSandbox.

      <iframe
        src="https://codesandbox.io/embed/${SANDBOX_ID_PATTERN}?fontsize=14px&hidenavigation=1&theme=dark&module=%2Fsrc%2Findex.js"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        title="React"
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      ></iframe>
      "
    `;
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

    const { contents } = await processor.process(createFile(md));

    expect(contents).toMatchStringWithPatterns`
      "# remark-codesandbox example

      The below code block will be replaced with an iFrame of embedded CodeSandbox.

      <iframe
        src="https://codesandbox.io/embed/${SANDBOX_ID_PATTERN}?fontsize=14px&hidenavigation=1&theme=dark&module=%2Fsrc%2Findex.js"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        title="remark-codesandbox example"
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      ></iframe>
      "
    `;
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
          entry: 'src/styles.css',
        },
        file: {
          extends: `file:${path.resolve(
            __dirname,
            '../../fixtures/custom-react-template'
          )}`,
          entry: 'src/index.js',
        },
      },
      autoDeploy: true,
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

    const { contents } = await processor.process(createFile(md));

    expect(contents).toMatchStringWithPatterns`
      "The below code block will create codesandbox based on custom template.

      <iframe
        src="https://codesandbox.io/embed/${SANDBOX_ID_PATTERN}?fontsize=14px&hidenavigation=1&theme=dark&module=%2Fsrc%2Fstyles.css"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        title="React"
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      ></iframe>
      "
    `;
  });

  (typeof window === 'undefined' ? test : test.skip)(
    'extending from file system',
    async () => {
      const md = dedent`
      The below code block will create codesandbox based on custom template.

      \`\`\`jsx codesandbox=file
      import React from 'react';
      import ReactDOM from 'react-dom';

      const rootElement = document.getElementById('root');
      ReactDOM.render(<h1>Hello remark-codesandbox!</h1>, rootElement);
      \`\`\`\n
    `;

      const { contents } = await processor.process(createFile(md));

      expect(contents).toMatchStringWithPatterns`
        "The below code block will create codesandbox based on custom template.

        <iframe
          src="https://codesandbox.io/embed/${SANDBOX_ID_PATTERN}?fontsize=14px&hidenavigation=1&theme=dark&module=%2Fsrc%2Findex.js"
          style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
          title="custom-react-template"
          allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
          sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        ></iframe>
        "
      `;
    }
  );
});

// Legacy option
describe('DEPRECATED: iframe query', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, {
      mode: 'iframe',
      iframeQuery: {
        fontsize: 12,
        hidenavigation: 0,
      },
      autoDeploy: true,
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

    const { contents } = await processor.process(createFile(md));

    expect(contents).toMatchStringWithPatterns`
      "The below code block will create codesandbox and inject custom iframe query.

      <iframe
        src="https://codesandbox.io/embed/${SANDBOX_ID_PATTERN}?fontsize=13&hidenavigation=0&module=%2Fsrc%2Findex.js"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        title="React"
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      ></iframe>
      "
    `;
  });
});

describe('query with mode iframe', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, {
      mode: 'iframe',
      query: {
        fontsize: 12,
        hidenavigation: 0,
      },
      autoDeploy: true,
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

    const { contents } = await processor.process(createFile(md));

    expect(contents).toMatchStringWithPatterns`
      "The below code block will create codesandbox and inject custom iframe query.

      <iframe
        src="https://codesandbox.io/embed/${SANDBOX_ID_PATTERN}?fontsize=13&hidenavigation=0&module=%2Fsrc%2Findex.js"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        title="React"
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      ></iframe>
      "
    `;
  });
});

describe('query with mode button', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, {
      mode: 'button',
      query: {
        fontsize: 12,
        hidenavigation: 0,
      },
      autoDeploy: true,
    });
  });

  test('with inline override', async () => {
    const md = dedent`
      The below code block will create codesandbox and inject custom query.

      \`\`\`css codesandbox=react?fontsize=13
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(createFile(md));

    expect(contents.slice(0, md.length)).toBe(md);
    expect(contents.slice(md.length + 1)).toMatchStringWithPatterns`
      "[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/${SANDBOX_ID_PATTERN}?fontsize=13&hidenavigation=0&module=%2Fsrc%2Findex.js)
      "
    `;
  });
});

describe('autoDeploy false', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, {
      mode: 'button',
    });
  });

  test('with button', async () => {
    const md = dedent`
      The below code block will create codesandbox and inject custom query.

      \`\`\`css codesandbox=react
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(createFile(md));

    expect(contents.slice(0, md.length)).toBe(md);
    const button = contents.slice(md.length + 1).trim();

    const beginning =
      '[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/api/v1/sandboxes/define?parameters=';
    const ending = '&query=module%3D%252Fsrc%252Findex.js)';

    expect(button.startsWith(beginning)).toBe(true);
    expect(button.endsWith(ending)).toBe(true);
    expect(button.slice(beginning.length, -ending.length)).toMatch(
      SANDBOX_ID_PATTERN
    );
  });
});

describe('overrideEntry', () => {
  let processor;

  beforeAll(() => {
    processor = remark().use(codesandbox, {
      mode: 'button',
    });
  });

  test('overrideEntry with override range lines', async () => {
    const md = dedent`
      The below code block will create codesandbox and inject custom query.

      \`\`\`css codesandbox=react?overrideEntry=4-12
      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(createFile(md));

    expect(contents).toMatchStringWithPatterns`
      "The below code block will create codesandbox and inject custom query.

      \`\`\`css codesandbox=react?overrideEntry=4-12
      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`

      [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/api/v1/sandboxes/define?parameters=${PARAMETER_PATTERN}&query=module%3D%252Fsrc%252Findex.js)
      "
    `;
  });

  test('overrideEntry false', async () => {
    const md = dedent`
      The below code block will create codesandbox and inject custom query.

      \`\`\`css codesandbox=react?overrideEntry=false
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`\n
    `;

    const { contents } = await processor.process(createFile(md));

    expect(contents).toMatchStringWithPatterns`
      "The below code block will create codesandbox and inject custom query.

      \`\`\`css codesandbox=react?overrideEntry=false
      import React from 'react';
      import ReactDOM from 'react-dom';

      ReactDOM.render(
        <h1>Hello remark-codesandbox!</h1>,
        document.getElementById('root')
      );
      \`\`\`

      [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/api/v1/sandboxes/define?parameters=${PARAMETER_PATTERN}&query=module%3D%252Fsrc%252Findex.js)
      "
    `;
  });
});
