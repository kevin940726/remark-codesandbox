const fetch = require('isomorphic-fetch');

function mergeTemplates(baseTemplate, targetTemplate) {
  return {
    ...baseTemplate,
    ...targetTemplate,
    files: {
      ...(baseTemplate.files || {}),
      ...(targetTemplate.files || {}),
    },
  };
}

function getFilePath(mappings, shortid) {
  const dir = mappings[shortid];

  if (!dir) {
    return null;
  }

  return [getFilePath(mappings, dir.directory_shortid), dir.title]
    .filter(Boolean)
    .join('/');
}

/**
 * `templateID` can be either:
 *  - sandbox id
 *  - `file:` path
 *  - custom sandbox id
 */
async function getTemplate(templates, templateID, customTemplates, file) {
  if (templates.has(templateID)) {
    return templates.get(templateID);
  }

  if (customTemplates[templateID]) {
    const baseTemplate = await getTemplate(
      templates,
      customTemplates[templateID].extends,
      customTemplates
    );

    const template = mergeTemplates(baseTemplate, customTemplates[templateID]);

    templates.set(templateID, template);

    return template;
  }

  let template;

  if (templateID.startsWith('file:')) {
    if (typeof window !== 'undefined') {
      throw new Error(
        '"file:" template is not supported in browser environment!'
      );
    }

    const directoryPath = templateID.slice('file:'.length);
    template = await require('./fsTemplate')(
      directoryPath,
      file ? file.dirname : process.cwd()
    );
  } else {
    try {
      const response = await fetch(
        `https://codesandbox.io/api/v1/sandboxes/${templateID}`
      ).then(res => res.json());

      template = response.data;
    } catch (err) {
      console.error(`Failed to get the sandbox template: ${templateID}`);
      throw err;
    }

    // Construct files/directories mappings
    const mappings = {};

    (template.directories || []).forEach(dir => {
      mappings[dir.shortid] = dir;
    });
    (template.modules || []).forEach(file => {
      mappings[file.shortid] = file;
    });

    // Construct files mappings
    const files = {};

    (template.modules || []).forEach(file => {
      const path = getFilePath(mappings, file.shortid);

      files[path] = { content: file.code };
    });

    template.files = files;
  }

  templates.set(templateID, template);

  return template;
}

module.exports = getTemplate;
