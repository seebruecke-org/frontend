import { useTranslation } from 'next-i18next';
import { memo } from 'react';
import dynamic from 'next/dynamic';
import hirestime from 'hirestime';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';
import logger from '@/lib/logger';
import BlockSwitch from '@/components/BlockSwitch';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';
import MapList from '@/components/MapList';

import { fetchCampaignBySlug } from '@/lib/campaigns';
import { convertToMapData, fetchMap } from '@/lib/map';

const Map = dynamic(() => import('@/components/Map'));
const MemoizedMap = memo(Map);

/* Transforms map data into a nested structure of countries, federal countries, and cities
  Example output:
  [
    {
      name: "Germany",
      federalCountries: [
        {
          name: "Bavaria",
          cities: [
            { name: "Munich", uri: "http://..." },
            { name: "Nuremberg", uri: "http://..." }
          ]
        }
      ]
    }
  ]
*/
function toCountryFederalCityData(features) {
  const countries = [];

  for (const feature of features) {
    if (!feature || !feature.properties) continue;

    const props = feature.properties;
    const cityName = props.name;
    const uri = props.uri || props.url || '';
    const federalObj = props.federal_country || {};
    const federal = federalObj.name;
    const countryObj = federalObj.country || {};
    const country = countryObj.name;

    if (!cityName || !country || !federal) continue;

    let countryEntry = countries.find(c => c.name === country);
    if (!countryEntry) {
      countryEntry = { name: country, federalCountries: [] };
      countries.push(countryEntry);
    }

    let federalEntry = countryEntry.federalCountries.find(f => f.name === federal);
    if (!federalEntry) {
      federalEntry = { name: federal, cities: [] };
      countryEntry.federalCountries.push(federalEntry);
    }

    federalEntry.cities.push({ name: cityName, uri });
  }

  return countries;
}

export default function TakePartPage({
  content,
  mapData
}) {
  const { t } = useTranslation();

  const countriesFederalCities = toCountryFederalCityData(mapData);

  if (Array.isArray(mapData)) {
    for (const feature of mapData) {
      if (feature && feature.properties) {
        feature.properties.type = 'city';
      }
    }
  }

  return (
    <PageBody
      firstBlock={getFirstBlockName(content)}
      lastBlock={getLastBlockName(content)}
    >
      <SEO title={t('map.bezahlkarte')} />
      <BlockSwitch blocks={content} />

      <div className="grid grid-layout-primary border-gray-400 border-t-2 mt-12 md:mt-24">
        <MemoizedMap features={mapData} />
        <MapList countries={countriesFederalCities}></MapList>
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
