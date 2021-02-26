import { fetchAPI } from './api';

import { FRAGMENT as FRAGMENT_NEWS_TEASER } from '@/components/Teaser/NewsEntry';

import { getFragments } from '@/components/Blocks';

export async function fetchRecentNews() {
  const { news } = await fetchAPI(`
    query {
      news: newsEntries(sort: "published_at:desc") {
        ${FRAGMENT_NEWS_TEASER}
      }
    }
  `);

  return news;
}

export async function fetchNewsBySlug(slug) {
  const { news } = await fetchAPI(`
    query {
      news: newsEntries(where: { slug: "${slug}" }) {
        title
        publishedAt: published_at
        content {
          __typename
          ${getFragments({
            exclude: [
              'SubNavigation',
              'StageLarge',
              'StageMedium',
              'Unterbrecher'
            ]
          })}
        }
      }
    }
  `);

  const entry = (news && news[0]) || null;

  return {
    data: entry
  };
}

export async function fetchAllNewsPaths() {
  const { news } = await fetchAPI(`
    query {
      news: newsEntries {
        slug
      }
    }
  `);

  return news.map(({ slug }) => ({
    locale: 'de',
    params: {
      slug: [slug]
    }
  }));
}
