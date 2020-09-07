jest.mock('isomorphic-fetch', () =>
  jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            id: 'mock-template',
            directories: [],
            modules: [],
          },
        }),
    })
  )
);

const getTemplate = require('../getTemplate');
const fetch = require('isomorphic-fetch');

afterAll(() => {
  jest.unmock('isomorphic-fetch');
});

test('only call the fetch from cache if available', async () => {
  const templates = new Map();

  const template = await getTemplate(templates, 'new', {});

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(template).toEqual({
    id: 'mock-template',
    directories: [],
    modules: [],
    files: {},
  });

  const reactTemplate = await getTemplate(templates, 'new', {});

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(reactTemplate).toEqual(template);
});
