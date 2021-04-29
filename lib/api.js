import { createClient, defaultExchanges } from 'urql';

const client = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_API,
  exchanges: defaultExchanges
});

export const fetchAPI = (query) =>
  client
    .query(query)
    .toPromise()
    .then(({ data }) => data);
