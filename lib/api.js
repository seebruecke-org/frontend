import {
  createClient,
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

export const fetchAPI = (query) => {
  const client = createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_API,
    exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange]
  });

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
