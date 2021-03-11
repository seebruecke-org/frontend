import { fetchAPI } from './api';

export async function fetchAllRedirects() {
  const { redirects } = await fetchAPI(`
    query {
      redirects {
        from
        to
        type
      }
    }
  `);

  if (!redirects) {
    return [];
  }

  return redirects.map(({ from, to, type }) => ({
    source: from,
    destination: to,
    permanent: type === 'permanently'
  }));
}
