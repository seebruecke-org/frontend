import {
  createClient as createUrqlClient,
  ssrExchange,
  dedupExchange,
  cacheExchange,
  fetchExchange
} from 'urql/core';

const ssr = ssrExchange({
  // https://github.com/FormidableLabs/urql/blob/main/packages/next-urql/src/with-urql-client.ts#L54
  isClient: true,
  initialState: undefined,
  staleWhileRevalidate: true
});

export function createClient() {
  return createUrqlClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_API,
    exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange]
  });
}

export async function fetchAPI(query, options = {}) {
  let ret = await fetchAPIWithRetries(query, options, 10);
  let simplifiedRet = normalize(ret);
  return simplifiedRet;
}

const normalize = (data) => {
  const isObject = (data) =>
    Object.prototype.toString.call(data) === '[object Object]';
  const isArray = (data) =>
    Object.prototype.toString.call(data) === '[object Array]';

  const flatten = (data) => {
    if (!data.attributes) return data;

    let idret = {};
    if (data.id) {
      idret = { id: data.id };
    }
    return {
      ...idret,
      ...data.attributes
    };
  };

  if (isArray(data)) {
    return data.map((item) => normalize(item));
  }

  if (isObject(data)) {
    if (isArray(data.data)) {
      data = [...data.data];
    } else if (isObject(data.data)) {
      data = flatten({ ...data.data });
    } else if (data.data === null) {
      data = null;
    } else {
      data = flatten(data);
    }

    for (const key in data) {
      let meta = false;
      if (isObject(data[key]) && isObject(data[key].meta)) {
        meta = data[key].meta;
      }

      data[key] = normalize(data[key]);

      if (meta) {
        data.meta = meta;
      }
    }
    return data;
  }

  return data;
};

export const fetchAPIWithRetries = (query, options = {}, retries = 5) => {
  const client = options?.client ?? createClient();

  return client
    .query(query)
    .toPromise()
    .then(({ data, error }) => {
      if (
        error &&
        error.name === 'CombinedError' &&
        error.networkError?.code === 'ECONNRESET' &&
        retries > 0
      ) {
        return fetchAPIWithRetries(query, options, retries - 1);
      }
      if (error) {
        console.log('\x1b[41m');
        console.error('error:' + error);
        console.trace();

        console.log('\x1b[0m');
        console.log('\x1b[0m \x1b[33m');
        console.error('query:' + query);
        console.log('\x1b[0m');
      }

      return data;
    });
};
