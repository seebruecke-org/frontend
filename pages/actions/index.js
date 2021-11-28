import { useTranslation } from 'next-i18next';
import { useState, useEffect, memo, useRef } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { createClient } from '@/lib/api';
import { getSlugFromI18nNext } from '@/lib/slug';
import { fetchAllActions } from '@/lib/actions';
import { query as queryGlobalData } from '@/lib/global';
import { getPage } from '@/lib/pages';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';
import Action from '@/components/Teaser/Action';
import BlockSwitch from '@/components/BlockSwitch';
import Form from '@/components/Form';
import PageBody from '@/components/PageBody';
import Row from '@/components/Form/Row';
import SEO from '@/components/SEO';
import TextInput from '@/components/Form/TextInput';

const FederalCountry = dynamic(() => import('@/components/Map/FederalCountry'));
const Map = dynamic(() => import('@/components/Map'));

function filterActions(actions, term) {
  return Object.keys(actions).reduce((acc, key) => {
    const keyedActions = actions[key];
    const matchingActions = keyedActions.filter(
      ({ location, title }) => location.includes(term) || title.includes(term)
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
      <SEO title={t('actions.pluralTitle')} />

      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary border-gray-400 border-t-2 mt-12 md:mt-24">
        <MemoizedMap
          features={Object.keys(actions)
            .map((key) => actions[key])
            .flat()
            .filter(({ coordinates }) => !!coordinates?.geometry)
            .map(({ title, id, coordinates: { geometry } }) => ({
              type: 'Feature',
              properties: {
                name: title,
                id,
                type: 'action'
              },
              geometry: {
                ...geometry,
                coordinates: geometry.coordinates
              }
            }))}
        />

        <div className="col-span-full md:col-start-7 md:col-span-8 pb-10 md:pb-36">
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
            <Row primaryGrid={false} className="md:col-span-5">
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
                  {t('actions.resetFilter')}
                </button>
              )}
            </Row>
          </Form>

          <ul ref={actionsListRef}>
            {Object.keys(actions).map((key, index) => (
              <li
                key={`action-date-${index}`}
                className={clsx(index > 0 && 'mt-12 md:mt-20')}
              >
                <FederalCountry
                  count={actions[key].length}
                  singularKicker={t('action.singleTitle')}
                  pluralKicker={t('action.pluralTitle')}
                  name={key}
                />

                <ul className="grid grid-cols-1 md:grid-cols-3 gap-10 px-1 md:px-0">
                  {actions[key].map(
                    ({ location, start, intro, title, slug }, actionIndex) => (
                      <li key={`action-${actionIndex}`} className="h-full">
                        <Action
                          title={location}
                          meta={`${start} ${tf('timePostfix')}`}
                          intro={intro || title}
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
  const { initialState, ...globalData } = await queryGlobalData(locale, [], {
    client
  });
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const pageSlug = getSlugFromI18nNext('actions', locale, globalData);

  const [actions, page] = await Promise.all([
    await fetchAllActions(locale, format, { client }),
    await getPage(pageSlug, undefined, locale, format, { client })
  ]);

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
