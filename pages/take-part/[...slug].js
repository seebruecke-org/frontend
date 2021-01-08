import React from 'react';

import { RETURN_CODES } from '../../lib/constants';
import { query as queryGlobalData } from '../../lib/global';
import { query } from '../../lib/take-part';

import { StageMedium } from '@/components/Stages';
import BlockSwitch from '@/components/BlockSwitch';
import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';
import VStack from '@/components/VStack';

export default function TakePartPage({ city, page, siblings }) {
  return <>
    <SEO title={`${page.title} ${city.title}`} />

    <Breadcrumbs crumbs={[
      {
        path: '/mach-mit/',
        label: 'Mach Mit'
      },

      {
        path: '/mach-mit/brandenburg/',
        label: 'Brandenburg'
      }
    ]} />

    <VStack gap={20}>
      {city && (
        <StageMedium kicker={page.title} title={city.title} siblings={siblings} image={page?.featuredImage?.node} />
      )}

      <BlockSwitch blocks={page.blocks} />
    </VStack>
  </>
}

export async function getServerSideProps({ locale, params: { slug } }) {
  const { type, data, ...res } = await query(slug, locale);
  const globalData = await queryGlobalData(locale);

  if (type === RETURN_CODES.REDIRECT) {
    return {
      redirect: {
        destination: res.destination,
        permanent: true
      }
    }
  }

  if (data === null) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      ...data,
      initialState: globalData
    }
  }
}
