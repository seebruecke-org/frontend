import React from 'react';

import { query as queryGlobalData } from '../lib/global';
import { query, paths } from '../lib/pages';

import BlockSwitch from '@/components/BlockSwitch';
import SEO from '@/components/SEO';

export default function TakePartPage({ page }) {
  return (
    <article>
      <SEO title={page.title} />
      <BlockSwitch blocks={page.blocks} />
    </article>
  );
}

export async function getStaticPaths({ defaultLocale }) {
  const sidePaths = await paths();
  const staticPaths = sidePaths.map(({ uri, language }) => {
    return {
      locale: language?.slug ?? defaultLocale,
      params: {
        slug: uri.split('/').slice(2)
      }
    };
  });

  return {
    fallback: true,
    paths: staticPaths
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  if (slug && slug[0] === 'take-part') {
    slug[0] = 'mach-mit';
  }

  const { data } = await query(slug, locale);
  const { initialState, ...globalData } = await queryGlobalData(locale);

  if (data === null) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
