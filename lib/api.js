import { createClient } from 'urql';

import useSWR from 'swr';

const client = createClient({
  url: process.env.WP_GRAPHQL_API
});

export const fetchAPI = (query) => client.query(query).toPromise();

export default function useAPI(query) {
  return useSWR(query, fetchAPI);
}
