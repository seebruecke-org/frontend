import { useTranslation } from 'next-i18next';
import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import hirestime from 'hirestime';

import { createClient } from '@/lib/api';
import { getSlugFromI18nNext } from '@/lib/slug';
import { fetchAllActions } from '@/lib/actions';
import { query as queryGlobalData } from '@/lib/global';
import { getPage } from '@/lib/pages';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';
import logger from '@/lib/logger';

import Action from '@/components/Teaser/Action';
import BlockSwitch from '@/components/BlockSwitch';
import Form from '@/components/Form';
import PageBody from '@/components/PageBody';
import Row from '@/components/Form/Row';
import SEO from '@/components/SEO';
import TextInput from '@/components/Form/TextInput';

const Map = dynamic(() => import('@/components/Map'));

function filterActions(actions, term) {
  return Object.keys(actions).reduce((acc, key) => {
    term = term.toLowerCase();
    const keyedActions = actions[key];
    const matchingActions = keyedActions.filter(
      ({ location, title }) => location.toLowerCase().includes(term) || title.toLowerCase().includes(term)
    );

    if (matchingActions.length > 0) {
      acc[key] = matchingActions;
    }

    return acc;
  }, {});
}

const MemoizedMap = memo(Map);

export default function TakePartPage({ actions: defaultActions, page }) {
  const { t } = useTranslation();
  const { t: ts } = useTranslation('slugs');
  const { t: tf } = useTranslation('format');
  const [filterValue, setFilterValue] = useState(null);
  const [actions, setActions] = useState(defaultActions);
  const actionsListRef = useRef(null);

  useEffect(() => {
    if (filterValue) {
      setActions(filterActions(defaultActions, filterValue));
    } else {
      setActions(defaultActions);
    }
  }, [filterValue]);

  return (
    <PageBody
      firstBlock={getFirstBlockName(page?.content)}
      lastBlock={getLastBlockName(page?.content)}
    >
      <SEO title={t('action.pluralTitle')} />

      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary border-gray-400 border-t-2 mt-12 md:mt-24">
        <MemoizedMap
          features={Object.keys(actions)
            .map((key) => actions[key])
            .flat()
            .filter(({ coordinates }) => !!coordinates?.geometry)
            .map(({ title, id, slug, coordinates: { geometry } }) => ({
              type: 'Feature',
              properties: {
                name: title,
                id,
                type: 'action',
                uri: `/${ts('actions')}/${slug}`
              },
              geometry: {
                ...geometry,
                coordinates: geometry.coordinates
              }
            }))}
        />

        <div className="col-span-full md:col-start-7 md:col-span-8 pb-10 md:pb-36 pr-12">
          <Form
            primaryGrid={false}
            className="grid-cols-6"
            onSubmit={(event) => {
              event.preventDefault();

              actionsListRef?.current?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            <Row primaryGrid={false}>
              <TextInput
                name="filter"
                placeholder={t('action.filter')}
                value={filterValue}
                onChange={(event) => {
                  setFilterValue(event.target.value);
                }}
                autoComplete="off"
              />

              {filterValue && (
                <button
                  type="button"
                  onClick={() => setFilterValue('')}
                  className="justify-start w-max mt-4 font-rubik text-2xs text-gray-600"
                >
                  {t('action.resetFilter')}
                </button>
              )}
            </Row>
          </Form>

          <ul ref={actionsListRef}>
            {Object.keys(actions).map((key, index) => (
              <li
                key={`action-date-${index}`}
              >

                <h3 className="font-brezel text-medium font-light italic leading-none px-5 py-10 text-gray-600 relative text-center sticky top-0 bg-white">
                  <span className="absolute top-2/4 left-0 w-full h-1 border-t border-gray-600" />
                  <span className="bg-white relative px-16">
                    {key}
                  </span>
                </h3>

                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-8 px-8 md:px-0">
                  {actions[key].map(
                    ({ location, starttime, intro, title, slug, location_detail }, actionIndex) => (
                      
                      <li key={`action-${actionIndex}`} className="h-full">
                        <Action
                          city={location}
                          start={starttime && `${starttime} ${tf('timePostfix')}`}
                          address={location_detail}
                          title={intro || title}
                          slug={slug}
                        />
                      </li>
                    )
                  )}
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
  const pageSlug = getSlugFromI18nNext('actions', locale, globalData);

  const [actions, page] = await Promise.all([
    await fetchAllActions(locale, format, { client }),
    await getPage(pageSlug, undefined, locale, format, { client })
  ]);

  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/actions/index`,
    time: getElapsed.seconds()
  });

  return {
    revalidate: 60 * 2,
    props: {
      actions,
      page,
      ...globalData,
      initialState
    }
  };
}
