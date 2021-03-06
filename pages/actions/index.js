import { useI18n } from 'next-localization';
import { format } from 'date-fns';
import { useState, useEffect, memo, useRef } from 'react';

import { fetchAllActions } from '@/lib/actions';
import { query as queryGlobalData } from '@/lib/global';
import { getPage } from '@/lib/pages';

import { FederalCountry, Map } from '@/components/Map';
import Action from '@/components/Teaser/Action';
import BlockSwitch from '@/components/BlockSwitch';
import Form, { Row, TextInput } from '@/components/Form';
import SEO from '@/components/SEO';

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
  const i18n = useI18n();
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
      <SEO title={i18n.t('actions.pluralTitle')} />

      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary">
        <MemoizedMap />

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
                placeholder={i18n.t('action.filter')}
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
                className={`${index > 0 && 'mt-20'}`}
              >
                <FederalCountry
                  count={actions[key].length}
                  singularKicker={i18n.t('action.singleTitle')}
                  pluralKicker={i18n.t('action.pluralTitle')}
                  name={key}
                />

                <ul className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {actions[key].map(
                    ({ location, start, intro, title, slug }, actionIndex) => (
                      <li key={`action-${actionIndex}`} className="h-full">
                        <Action
                          title={location}
                          meta={`${format(
                            new Date(start),
                            `${i18n.t('action.dateFormat')}, ${i18n.t(
                              'action.timeFormat'
                            )}`
                          )} ${i18n.t('action.timePostfix')}`}
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
    revalidate: 60,
    props: {
      actions,
      page,
      ...globalData,
      initialState
    }
  };
}
