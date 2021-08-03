import { createClient } from 'urql';

const client = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_API,
  requestPolicy: 'cache-and-network'
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
