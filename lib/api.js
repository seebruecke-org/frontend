import { createClient } from 'urql';
import { Agent } from 'http';

const agent = new Agent();

global.fetch = (url, opts) => fetch(url, { ...opts, agent });

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
