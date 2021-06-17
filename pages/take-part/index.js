import React from 'react';

import { query as queryGlobalData } from '@/lib/global';
import { query } from '@/lib/pages';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';
import { getSlugFromI18nNext } from '@/lib/slug';

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

      <BlockSwitch
        blocks={page?.content}
        blockProps={{
          SubNavigation: {
            alwaysShowBorder: true
          }
        }}
      />
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const { initialState = null, ...globalData } = await queryGlobalData(locale);
  const pageSlug = getSlugFromI18nNext('take-part', locale, globalData);
  const { data } = await query([pageSlug], locale);

  if (data === null) {
    return {
      notFound: true
    };
  }

  return {
    // TODO: find a good magic number here
    revalidate: 60,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
