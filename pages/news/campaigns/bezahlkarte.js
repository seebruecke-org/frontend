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
import NextLink from 'next/link';
import { fetchCampaignBySlug } from '@/lib/campaigns';
import { mapData } from '@/lib/data/bezahlkarteMapData';
import { convertToMapData, fetchMap } from '@/lib/map';

const Map = dynamic(() => import('@/components/Map'));

const MemoizedMap = memo(Map);

export default function TakePartPage({
  actions: defaultActions,
  content,
  mapData
}) {
  const { t } = useTranslation();

  const federal_countries = [
    ...new Set(mapData.map((l) => l.properties.federal_country.name))
  ];

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
          <ul className="flex flex-col space-y-10">
            {federal_countries.map((fc_name) => (
              <li key={`federal-country-${fc_name}`} className="h-full">
                <h3 className="font-brezel italic text-xl font-bold leading-none px-8 py-8 md:py-10">
                  {' '}
                  {fc_name}
                </h3>
                <ul className="grid md:grid-cols-2 gap-8 px-6">
                  {mapData
                    .filter(
                      (l) => l.properties.federal_country.name === fc_name
                    )
                    .map((value, index) => (
                      <li key={`action-${index}`} className="h-full">
                        <NextLink href={value.properties.uri}>
                          <h4 className="font-brezel text-base font-bold italic">
                            <a className="bg-orange-200 hover:bg-orange-800 cursor-pointer p-5 flex justify-between">
                              {value.properties.name}
                              <svg
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 256 512"
                                className="w-5 h-auto mr-4 opacity-20"
                              >
                                <path
                                  fill="currentColor"
                                  d="M24.707 38.101 4.908 57.899c-4.686 4.686-4.686 12.284 0 16.971L185.607 256 4.908 437.13c-4.686 4.686-4.686 12.284 0 16.971L24.707 473.9c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L41.678 38.101c-4.687-4.687-12.285-4.687-16.971 0z"
                                ></path>
                              </svg>
                            </a>
                          </h4>
                        </NextLink>{' '}
                      </li>
                    ))}
                </ul>
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
  const mapData = convertToMapData(await fetchMap('bezahlkarte'));

  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/news/campaigns/bezahlkarte`,
    time: getElapsed.seconds()
  });

  return {
    revalidate: 60 * 2,
    props: {
      mapData,
      ...data,
      ...globalData,
      initialState
    }
  };
}
