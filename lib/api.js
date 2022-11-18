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

export const fetchAPI = (query, options = {}) => {
  return fetchAPIWithRetries(query, options, 10);
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
