import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import remark from 'remark';
import remarkExcerpt from 'remark-excerpt';
import truncate from 'truncate';

import { fetchAPI } from './api';
import { mergeMetadata } from './metadata';
import { getFullCMSUrl, getFullClientUrl } from './url';
import FRAGMENT_NEWS_TEASER from '@/components/Teaser/NewsEntry/fragment';
import { FRAGMENT as RICHTEXT_FRAGMENT } from '@/components/Blocks/Richtext/block';
import METADATA_FRAGMENT from '@/components/SEO/fragment';
import FRAGMENT_MEDIA from '@/components/Media/fragment';

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
  const translations = await import('@/locales/de/news.json');

  const { news } = await fetchAPI(`
    query {
      news: newsEntries(${filterQuery} sort: "publication_date:desc") {
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
      const publication_date = entry?.publication_date;

      return {
        ...entry,
        publication_date: format(
          new Date(publication_date),
          translations.dateFormat,
          {
            locale: de
          }
        ),
        excerpt
      };
    })
  );
}

export async function fetchNewsBySlug(slug, locale) {
  const translations = await import('@/locales/de/news.json');
  const { news } = await fetchAPI(`
    query {
      news: newsEntries(where: { slug: "${slug}" }) {
        title
        published_at
        type

        image {
          ${FRAGMENT_MEDIA}
        }

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
              'Actions',
              'MediaGallery',
              'Newsletter',
              'Fundraisingbox'
            ]
          })}
        }

        metadata {
          ${METADATA_FRAGMENT}
        }
      }
    }
  `);

  const entry = (news && news[0]) || null;

  if (entry) {
    entry.metadata = mergeMetadata(entry?.metadata, {
      title: entry.title,
      facebook_image:
        entry?.image?.media?.url &&
        getFullClientUrl(
          `/api/resize?url=${getFullCMSUrl(
            `${entry.image.media.url}&size=facebook`
          )}`
        ),

      twitter_image:
        entry?.image?.media?.url &&
        getFullClientUrl(
          `/api/resize?url=${getFullCMSUrl(
            `${entry.image.media.url}&size=twitter`
          )}`
        )
    });
  }

  // Prepend the news image to the richtext field, because we need to float
  // it. For this the richtext field is extended in the client.
  if (entry?.image?.media?.url && entry?.content) {
    entry.content[0].richtext = `![${entry.image.media.alternativeText}](${entry.image.media.url}) ${entry.content[0].richtext}`;
  }

  if (entry?.published_at) {
    entry.published_at = format(
      new Date(entry.published_at),
      translations.dateFormat,
      {
        locale: de
      }
    );
  }

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
