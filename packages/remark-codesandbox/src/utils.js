/**
 * type Query = string | { [key: string]: string } | URLSearchParams | undefined
 */

function parseMeta(metaString /* :string */) /* :{[key: string]: string} */ {
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

function mergeQuery(
  baseQuery /* :Query */,
  ...queries /* :Query[] */
) /* :URLSearchParams */ {
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

module.exports = {
  parseMeta,
  mergeQuery,
};
