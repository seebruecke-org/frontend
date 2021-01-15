import React from 'react';

import { query as queryGlobalData } from '../lib/global';
import { query, paths } from '../lib/pages';

import BlockSwitch from '@/components/BlockSwitch';
import SEO from '@/components/SEO';

export default function TakePartPage({ page }) {
  return (
    <article>
      <SEO title={page.title} />
      <BlockSwitch blocks={page.content} />
    </article>
  );
}

export async function getStaticPaths({ defaultLocale }) {
  const sidePaths = await paths();

  const staticPaths = sidePaths.map(({ slug }) => {
    return {
      locale: defaultLocale,
      params: {
        slug: [slug]
      }
    };
  });

  return {
    fallback: true,
    paths: staticPaths
  };
}

export async function getStaticProps({ locale, params }) {
  const { slug } = params;

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
