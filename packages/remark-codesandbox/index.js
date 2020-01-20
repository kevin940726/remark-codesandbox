const visit = require('unist-util-visit');
const is = require('unist-util-is');
const toString = require('mdast-util-to-string');
const u = require('unist-builder');
const { getParameters } = require('codesandbox/lib/api/define');
const got = require('got');
// URLSearchParams is added to the global object in node v10
const URLSearchParams =
  global.URLSearchParams || require('url').URLSearchParams;

const DEFAULT_CUSTOM_TEMPLATES = {
  react: {
    extends: 'new',
  },
  'react-component': {
    extends: 'new',
    entry: 'src/App.js',
  },
};

async function getTemplate(templates, templateID, customTemplates) {
  if (templates.has(templateID)) {
    return templates.get(templateID);
  }

  const baseTemplateID = customTemplates[templateID]
    ? customTemplates[templateID].extends
    : templateID;

  if (templates.has(baseTemplateID)) {
    const template = {
      ...templates.get(baseTemplateID),
      ...(customTemplates[templateID] || {}),
    };

    templates.set(templateID, template);
    return template;
  }

  const { data } = await got(
    `https://codesandbox.io/api/v1/sandboxes/${baseTemplateID}`
  ).json();

  const template = {
    ...data,
    ...(customTemplates[templateID] || {}),
  };

  // Construct files/directories mappings
  const mappings = {};

  template.directories.forEach(dir => {
    mappings[dir.shortid] = dir;
  });
  template.modules.forEach(file => {
    mappings[file.shortid] = file;
  });

  function getFilePath(shortid) {
    const dir = mappings[shortid];

    if (!dir) {
      return null;
    }

    return [getFilePath(dir.directory_shortid), dir.title]
      .filter(Boolean)
      .join('/');
  }

  // Construct files mappings
  const files = {};

  template.modules.forEach(file => {
    const path = getFilePath(file.shortid);

    files[path] = { content: file.code };
  });

  template.files = files;

  templates.set(templateID, template);

  return template;
}

function codesandbox(options = {}) {
  const templates = new Map();
  const mode = options.mode || 'meta';
  const customTemplates = {
    ...DEFAULT_CUSTOM_TEMPLATES,
    ...(options.customTemplates || {}),
  };
  const defaultQuery =
    mode === 'iframe'
      ? {
          fontsize: '14px',
          hidenavigation: 1,
          theme: 'dark',
        }
      : undefined;

  let baseQuery = defaultQuery;

  if (typeof options.query !== 'undefined') {
    baseQuery = options.query;
  } else if (typeof options.iframeQuery !== 'undefined') {
    // DEPRECATED: To support the legacy iframeQuery key
    console.warn(
      `options.iframeQuery is now deprecated and will be removed in the upcoming version, please use options.query instead.`
    );
    baseQuery = options.iframeQuery;
  }

  return async function transformer(tree) {
    let title;
    const codes = [];

    // Walk the tree once and record everything we need
    visit(tree, (node, index, parent) => {
      if (!title && is(node, ['heading', { depth: 1 }])) {
        title = toString(node);
      } else if (is(node, 'code')) {
        codes.push([node, index, parent]);
      }
    });

    for (const [node, _, parent] of codes) {
      const meta = parseMeta(node.meta || '');
      const sandboxMeta = meta.codesandbox;

      // No `codesandbox` meta set, skipping
      if (!sandboxMeta) {
        continue;
      }

      const [templateID, queryString] = sandboxMeta.split('?');
      const query = mergeQuery(baseQuery, queryString);

      const template = await getTemplate(
        templates,
        templateID,
        customTemplates
      );

      template.title = title || template.title;

      // If there is no predefined `module` key, then we assign it to the entry file
      if (!query.has('module')) {
        query.set(
          'module',
          // `entry` doesn't start with leading slash, but `module` requires it
          template.entry.startsWith('/') ? template.entry : `/${template.entry}`
        );
      }

      const parameters = getParameters({
        files: {
          ...template.files,
          [template.entry]: { content: node.value },
        },
      });

      // TODO: We might want to support skipping or caching the result to save network requests when developing
      const { sandbox_id } = await got
        .post('https://codesandbox.io/api/v1/sandboxes/define', {
          json: {
            parameters,
            json: 1,
          },
        })
        .json();

      const url = `https://codesandbox.io/s/${sandbox_id}?${query.toString()}`;

      switch (mode) {
        case 'button': {
          const button = u('paragraph', [
            u('link', { url }, [
              u('image', {
                url: 'https://codesandbox.io/static/img/play-codesandbox.svg',
                alt: 'Edit on CodeSandbox',
              }),
            ]),
          ]);

          // Insert the button directly after the code block
          const index = parent.children.indexOf(node);
          parent.children.splice(index + 1, 0, button);

          break;
        }
        case 'iframe': {
          // Construct the iframe AST
          const iframe = u('html', {
            value: `<iframe
  src="https://codesandbox.io/embed/${sandbox_id}?${query.toString()}"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="${template.title || ''}"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>`,
          });

          // Replace the code block with the iframe
          const index = parent.children.indexOf(node);
          parent.children.splice(index, 1, iframe);

          break;
        }
        case 'meta':
        default: {
          // TODO: We might still want to make this happen regardless of the mode?
          node.data = node.data || {};
          node.data.hProperties = node.data.hProperties || {};

          node.data.codesandboxUrl = url;
          node.data.hProperties.dataCodesandboxUrl = url;

          break;
        }
      }
    }
  };
}

function parseMeta(metaString) {
  const meta = {};

  metaString.split(' ').forEach(str => {
    const equalIndex = str.indexOf('=');

    if (equalIndex > 0) {
      const key = str.slice(0, equalIndex);
      const value = str.slice(equalIndex + 1);

      meta[key] = value;
    }
  });

  return meta;
}

function mergeQuery(baseQuery, ...queries) {
  const query = new URLSearchParams();

  // Interesting that chaining multiple URLSearchParams calls returns a single one
  // So baseQuery could be either `string`, `object`, `URLSearchParams`, or even `undefined`
  new URLSearchParams(baseQuery).forEach((value, key) => {
    query.set(key, value);
  });

  queries.forEach(params => {
    new URLSearchParams(params).forEach((value, key) => {
      query.set(key, value);
    });
  });

  return query;
}

module.exports = codesandbox;
