import { useTranslation } from 'next-i18next';
import { memo, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import hirestime from 'hirestime';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';
import logger from '@/lib/logger';
import BlockSwitch from '@/components/BlockSwitch';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';
import { mapData } from './bezahlkarteMapData';
import NextLink from 'next/link';
import { fetchCampaignBySlug } from '@/lib/campaigns';

const Map = dynamic(() => import('@/components/Map'));

const MemoizedMap = memo(Map);

export default function TakePartPage({ actions: defaultActions, content }) {
  const { t } = useTranslation();

  return (
    <PageBody
      firstBlock={getFirstBlockName(content)}
      lastBlock={getLastBlockName(content)}
    >
      <SEO title={t('actions.pluralTitle')} />
      <BlockSwitch blocks={content} />

      <div className="grid grid-layout-primary border-gray-400 border-t-2 mt-12 md:mt-24">
        <MemoizedMap features={mapData} />

        <div className="col-span-full md:col-start-7 md:col-span-8 pb-10 md:pb-36">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-1 md:px-0">
            {mapData.map((value, index) => (
              <li key={`action-${index}`} className="h-full">
                <NextLink href={value.properties.uri}>
                  <a className="block bg-turquoise-300 hover:bg-black hover:text-white px-8 py-10 md:p-10 h-full">
                    <h2 className="font-brezel text-medium md:text-large font-bold italic leading-tight mt-2">
                      {value.properties.name}
                    </h2>
                  </a>
                </NextLink>{' '}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const client = createClient();
  const getElapsed = hirestime();
  const { initialState, ...globalData } = await queryGlobalData(locale, [], {
    client
  });
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const { data } = await fetchCampaignBySlug('bezahlkarte', locale, format, {
    client
  });

  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/news/campaigns/bezahlkarte`,
    time: getElapsed.seconds()
  });

  return {
    revalidate: 60 * 2,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
