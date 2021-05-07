import algoliasearch from 'algoliasearch/lite';

export function initClient() {
  const client = algoliasearch(
    process.env.ALGOLIA_APPLICATION_ID,
    process.env.ALGOLIA_API_KEY
  );

  return client;
}

export async function search(term) {
  if (!term || term.length === 0) {
    return [];
  }

  const client = initClient();
  const index = client.initIndex(process.env.ALGOLIA_INDEX);

  const hits = await index.search(term);

  return hits?.hits ?? [];
}
