const fetch = require('isomorphic-fetch');

async function getTemplate(templates, templateID, customTemplates, file) {
  if (templates.has(templateID)) {
    return templates.get(templateID);
  }

  const isCustomTemplate = !!customTemplates[templateID];
  const baseTemplateID = isCustomTemplate
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

  let data;
  if (baseTemplateID.startsWith('file:')) {
    if (typeof window !== 'undefined') {
      throw new Error(
        '"file:" template is not supported in browser environment!'
      );
    }

    const directoryPath = baseTemplateID.slice('file:'.length);
    data = await require('./fsTemplate')(
      directoryPath,
      isCustomTemplate ? process.cwd() : file && file.dirname
    );
  } else {
    try {
      const response = await fetch(
        `https://codesandbox.io/api/v1/sandboxes/${baseTemplateID}`
      ).then(res => res.json());

      data = response.data;
    } catch (err) {
      console.error(
        `Failed to get the sandbox template: ${baseTemplateID} (via ${templateID})`
      );
      throw err;
    }
  }

  const template = {
    ...data,
    ...(customTemplates[templateID] || {}),
  };

  // Construct files/directories mappings
  const mappings = {};

  (template.directories || []).forEach(dir => {
    mappings[dir.shortid] = dir;
  });
  (template.modules || []).forEach(file => {
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

  (template.modules || []).forEach(file => {
    const path = getFilePath(file.shortid);

    files[path] = { content: file.code };
  });

  template.files = Object.assign({}, template.files, files);

  templates.set(templateID, template);

  return template;
}

module.exports = getTemplate;
