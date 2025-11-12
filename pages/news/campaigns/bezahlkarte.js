import { useTranslation } from 'next-i18next';
import { memo, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import hirestime from 'hirestime';
import clsx from 'clsx';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';
import logger from '@/lib/logger';
import BlockSwitch from '@/components/BlockSwitch';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';
import Group from '@/components/Teaser/Group';

import { fetchCampaignBySlug } from '@/lib/campaigns';
import { convertToMapData, fetchMap } from '@/lib/map';



const Map = dynamic(() => import('@/components/Map'));
const Country = dynamic(() => import('@/components/Map/Country'));
const FederalCountry = dynamic(() => import('@/components/Map/FederalCountry'));

const MemoizedMap = memo(Map);

// TODO das ist doppelt
function FederalCountries({ countries }) {
  const { t } = useTranslation('group');

  if (Object.values(countries).every(cities => cities.length === 1)) {
    const allCities = Object.values(countries).map(({ cities }) => cities).flat();
    return <Cities cities={sortCities(allCities)} />;
  }

  return (
    <ul className="flex flex-col space-y-10">
      {Object.keys(countries).map((federalCountryName) => {
        const cities = Object.keys(countries[federalCountryName]).map(cityName => ({
          name: cityName,
          uri: countries[federalCountryName][cityName]
        }));

        return (
          <li key={`federalCountry-${federalCountryName}`}>
            <FederalCountry name={federalCountryName}/>

            <Cities cities={sortCities(cities)} />
          </li>
        );
      })}
    </ul>
  );
}

// TODO das ist doppelt
function sortCities(cities) {
  return cities.sort(({ name: cityAName }, { name: cityBName }) =>
    cityAName.localeCompare(cityBName)
  );
}

// Todo das ist doppelt
function Cities({ cities }) {
  return (
    <ul className="grid md:grid-cols-2 gap-8 px-6">
      {cities.map((city) => (
        <li key={`city-${city.name}`}>
          <Group uri={city.uri} name={city.name} />
        </li>
      ))}
    </ul>
  );
}

/* Transforms map data into a nested structure of countries, federal countries, and cities
  Example output:
  {
    "Germany": {
      "Bavaria": {
        "Munich": { name: "Munich", uri: "http://..." },
        "Nuremberg": { name: "Nuremberg", uri: "http://..." }
      },
    },
  }
*/
function toCountryFederalCityData(features) {
  const countries = {};

  for (const feature of features) {
    if (!feature.properties)
      continue;

    const { name, uri, federal_country: { name: federal, country: { name: country } } } = feature.properties;

    if (!countries[country]) {
      countries[country] = {
        [federal]: { [name]: uri }
      };
      continue;
    }

    if (!countries[country][federal]) {
      countries[country][federal] = { [name]: uri };
      continue;
    }

    countries[country][federal][name] = uri;
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
      <SEO title={t('action.pluralTitle')} />
      <BlockSwitch blocks={content} />

      <div className="grid grid-layout-primary border-gray-400 border-t-2 mt-12 md:mt-24">
        <MemoizedMap features={mapData} />

        <div className="col-span-full md:col-start-7 md:col-span-8 pb-10 md:pb-36">
          <ul>
            {Object.keys(countriesFederalCities)
              .sort()
              .map((country, index) => (
                console.log(country, index),
                <li
                  key={`c-${country}`}
                  className={clsx(index > 0 && 'mt-12 md:mt-20')}
                >
                  <Country name={country} uri="" />

                  <FederalCountries
                    countries={Object.keys(countriesFederalCities[country])
                      .sort()
                      .reduce((result, key) => {
                        result[key] = countriesFederalCities[country][key];
                        return result;
                      }, {})}
                  />
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
