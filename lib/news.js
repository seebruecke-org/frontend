import remark from 'remark';
import remarkExcerpt from 'remark-excerpt';
import truncate from 'truncate';

import { fetchAPI } from './api';

import { FRAGMENT as FRAGMENT_NEWS_TEASER } from '@/components/Teaser/NewsEntry';
import { FRAGMENT as RICHTEXT_FRAGMENT } from '@/components/Blocks/Richtext';

import { getFragments } from '@/components/Blocks';

async function parseMarkdown(markdown) {
  return new Promise((resolve, reject) => {
    remark()
      .use(remarkExcerpt)
      .process(markdown, (err, file) => {
        if (err) {
          return reject(err);
        }

        const excerpt = file.toString();
        resolve(truncate(excerpt, 200));
      });
  });
}

export async function fetchRecentNews(options = {}) {
  const { filter } = options;
  const filterQuery = filter ? `where: { type: "${filter}" }, ` : '';

  const { news } = await fetchAPI(`
    query {
      news: newsEntries(${filterQuery} sort: "published_at:desc") {
        ${FRAGMENT_NEWS_TEASER}

        content {
          ${RICHTEXT_FRAGMENT}
        }
      }
    }
  `);

  return Promise.all(
    news.map(async (entry) => {
      const richtextContent = entry.content[0].richtext;
      const excerpt = await parseMarkdown(richtextContent);

      return {
        ...entry,
        excerpt
      };
    })
  );
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
              'Unterbrecher',
              'TeaserLarge',
              'TeasersSmall',
              'Actions'
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
