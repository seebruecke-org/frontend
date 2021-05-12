import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import { useState, useEffect, memo, useRef } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { fetchAllActions } from '@/lib/actions';
import { query as queryGlobalData } from '@/lib/global';
import { getPage } from '@/lib/pages';

import Action from '@/components/Teaser/Action';
import BlockSwitch from '@/components/BlockSwitch';
import Form from '@/components/Form';
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
    <article>
      <SEO title={t('actions.pluralTitle')} />

      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary">
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
                  Filter zurücksetzen
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
                          meta={`${format(
                            new Date(start),
                            `${t('action.dateFormat')}, ${t(
                              'action.timeFormat'
                            )}`
                          )} ${t('action.timePostfix')}`}
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
    </article>
  );
}

export async function getStaticProps({ locale }) {
  const actions = await fetchAllActions(locale);
  const page = await getPage('aktionen');
  const { initialState, ...globalData } = await queryGlobalData(locale);

  return {
    // TODO: find a good magic number here
    revalidate: 20,
    props: {
      actions,
      page,
      ...globalData,
      initialState
    }
  };
}
