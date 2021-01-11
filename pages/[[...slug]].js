import React from 'react';

import { query as queryGlobalData } from '../lib/global';
import { query } from '../lib/pages';

import BlockSwitch from '@/components/BlockSwitch';

export default function TakePartPage({ page }) {
  return <BlockSwitch blocks={page.blocks} />
}

export async function getServerSideProps({ locale, params: { slug } }) {
  if (slug && slug[0] === 'take-part') {
    slug[0] = 'mach-mit';
  }

  const { data } = await query(slug, locale);
  const { initialState, ... globalData } = await queryGlobalData(locale);

  if (data === null) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      ...data,
      ...globalData,
      initialState
    }
  }
}
