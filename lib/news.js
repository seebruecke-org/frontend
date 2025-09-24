import {format} from 'date-fns';
import {remark} from 'remark';
import remarkExcerpt from 'remark-excerpt';
import truncate from 'truncate';

import {fetchAPI} from './api';
import {mergeMetadata} from './metadata';
import {getFullCMSUrl, getFullClientUrl} from './url';
import FRAGMENT_NEWS_TEASER from '@/components/Teaser/NewsEntry/fragment';
import {FRAGMENT as RICHTEXT_FRAGMENT} from '@/components/Blocks/Richtext/block';
import METADATA_FRAGMENT from '@/components/SEO/fragment';
import FRAGMENT_MEDIA from '@/components/Media/fragment';

import {getFragments} from '@/components/Blocks';

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

export async function fetchPaginatedNews(
  options = {},
  locale,
  formatting,
  apiOptions
) {
  const { filter, perPage, pageNum } = options;
  const filterQuery = filter ? `filters: { type: {eq: "${filter}"} }, ` : '';

  const { meta, news } = await fetchAPI(
    `
    query {
      news: newsEntries(
              ${filterQuery} 
              sort: "publication_date:desc", 
              locale: "${locale}",
              pagination: {
                start:${(pageNum - 1) * perPage}, 
                limit: ${perPage}
              } 
        )
    {
    meta {
      pagination {
        page,
        pageCount,
        pageSize,
        total
      }
    }
    data{attributes{
        ${FRAGMENT_NEWS_TEASER}

        content {
          ${RICHTEXT_FRAGMENT}
        }
      }}}
    }
  `,
    apiOptions
  );

  return {
    meta: meta,
    news: Promise.all(
      news.map(async (entry) => {
        const richtextContent = entry.content[0]?.richtext;
        const excerpt = await parseMarkdown(richtextContent);
        const publishedAt = entry?.publishedAt;

        if (entry.publication_date) {
          entry.publication_date = format(new Date(entry.publication_date), formatting.date);
        }

        return {
          ...entry,
          publishedAt: format(new Date(publishedAt), formatting.date),
          excerpt
        };
      })
    )
  };
}

export async function fetchRecentNews(
  options = {},
  locale,
  formatting,
  apiOptions
) {
  const {filter} = options;
  const filterQuery = filter ? `filters: { type: {eq: "${filter}"} }, ` : '';

  const {news} = await fetchAPI(
    `
    query {
      news: newsEntries(${filterQuery} sort: "publication_date:desc", locale: "${locale}") {data{attributes{
        ${FRAGMENT_NEWS_TEASER}

        content {
          ${RICHTEXT_FRAGMENT}
        }
      }}}
    }
  `,
    apiOptions
  );

  return Promise.all(
    news.map(async (entry) => {
      const richtextContent = entry.content[0]?.richtext;
      const excerpt = await parseMarkdown(richtextContent);
      const publishedAt = entry?.publishedAt;
      
      if (entry.publication_date) {
        entry.publication_date = format(new Date(entry.publication_date), formatting.date);
      }

      return {
        ...entry,
        publishedAt: format(new Date(publishedAt), formatting.date),
        excerpt
      };
    })
  );
}

export async function fetchNewsBySlug(slug, locale, formatting, options) {
  const {news} = await fetchAPI(
    `
    query {
      news: newsEntries(filters: { slug: {eq:"${slug}"} }, locale: "${locale}") { data {attributes{
        title
        publication_date
        publishedAt
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
        'Newsletter',
        'Fundraisingbox'
      ]
    })}
        }

        metadata {
          ${METADATA_FRAGMENT}
        }
      }}}
    }
  `,
    options
  );

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

  if (entry?.publishedAt) {
    entry.publishedAt = format(new Date(entry.publishedAt), formatting.date);
  }

  if (entry?.publication_date) {
    entry.publication_date = format(new Date(entry.publication_date), formatting.date)
  }

  return {
    data: entry
  };
}

export async function fetchLatestNewsPaths(locale, options) {
  const {news} = await fetchAPI(
    `
    query {
      news: newsEntries(first: 10, orderBy: {createdAt: DESC})  {data{attributes{
        slug
      }}}
    }
  `,
    options
  );

  return news.map(({slug}) => ({
    locale,
    params: {
      slug: [slug]
    }
  }));
}
