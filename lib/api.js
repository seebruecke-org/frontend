import {
  createClient,
  ssrExchange,
  dedupExchange,
  cacheExchange,
  fetchExchange
} from 'urql/core';

const ssr = ssrExchange({
  isClient: false,
  initialState: undefined,
  staleWhileRevalidate: true
});

const client = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_API,
  exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange]
});

export const fetchAPI = (query) =>
  client
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
