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
  console.log('FETCH: ' + query);
  let ret = await fetchAPIWithRetries(query, options, 10);
  console.log({ret});
  let simplifiedRet = normalize(ret);
  console.log({simplifiedRet});
  return simplifiedRet;
}
const normalize = (data) => {
  const isObject = (data) =>
    Object.prototype.toString.call(data) === "[object Object]";
  const isArray = (data) =>
    Object.prototype.toString.call(data) === "[object Array]";

  const flatten = (data) => {
    if (!data.attributes) return data;

    return {
      id: data.id,
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
      data[key] = normalize(data[key]);
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
      if (error && error.name === 'CombinedError' && error.networkError?.code === 'ECONNRESET' && retries > 0) {
        return fetchAPIWithRetries(query, options, retries - 1);
      }
      if (error) {
        console.error({
          error,
          query
        });
      }

      return data;
    });
};
