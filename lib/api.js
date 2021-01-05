import { request } from 'graphql-request';
import useSWR from 'swr';

export const fetchAPI = (query) => request(process.env.WP_GRAPHQL_API, query);

export default function useAPI(query) {
  return useSWR(query, fetchAPI);
}
