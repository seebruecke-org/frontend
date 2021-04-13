import React from 'react';

import { query as queryGlobalData } from '@/lib/global';
import { query } from '@/lib/pages';
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

export async function getStaticProps({ locale }) {
  const { data } = await query('mach-mit', locale);
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

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
