import { search as searchAlgolia } from '@/lib/algolia';

export async function search(query) {
  const hits = await searchAlgolia(query);

  return hits;
}
