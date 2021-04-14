import React from 'react';

import { query as queryGlobalData } from '@/lib/global';
import { query, paths } from '@/lib/pages';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';

import BlockSwitch from '@/components/BlockSwitch';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

export default function GenericPage({ page }) {
  return (
    <PageBody
      firstBlock={getFirstBlockName(page?.content)}
      lastBlock={getLastBlockName(page?.content)}
    >
      <SEO title={page?.title} metadata={page?.metadata} />
      <BlockSwitch blocks={page?.content} />
    </PageBody>
  );
}

export async function getStaticPaths({ defaultLocale }) {
  const sidePaths = await paths();
  const { slugs } = await import(`../locales/de/common.json`);
  const customPages = Object.values(slugs);

  const staticPaths = sidePaths
    .map((slug) => {
      if (customPages.includes(slug.join('/'))) {
        return null;
      }

      return {
        locale: defaultLocale,
        params: {
          slug
        }
      };
    })
    .filter(Boolean);

  return {
    fallback: true,
    paths: staticPaths
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const { slugs } = await import(`../locales/de/common.json`);
  const normalizedSlug = slug ? slug.map((slug) => slugs[slug] || slug) : slug;
  const { data } = await query(normalizedSlug, locale);
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

  console.log('Page', 'getStaticProps', normalizedSlug);

  if (data === null) {
    return {
      notFound: true
    };
  }

  return {
    revalidate: 20,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
