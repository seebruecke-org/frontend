import {
  createClient as createUrqlClient,
  ssrExchange,
  dedupExchange,
  cacheExchange,
  fetchExchange
} from 'urql/core';

import logger from './logger';

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
  const client = options?.client ?? createClient();

  return client
    .query(query)
    .toPromise()
    .then(({ data, error }) => {
      if (error) {
        console.error({
          error,
          query
        });
      }

      return data;
    });
};
