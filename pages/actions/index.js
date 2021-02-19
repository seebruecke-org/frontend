import { fetchAllActions } from '@/lib/actions';
import { query as queryGlobalData } from '@/lib/global';
import { useI18n } from 'next-localization';
import { format } from 'date-fns';

import { FederalCountry, Action, Map } from '@/components/Map';
import Form, { Row, TextInput } from '@/components/Form';
import SEO from '@/components/SEO';

export default function TakePartPage({ actions }) {
  const i18n = useI18n();

  return (
    <article>
      <SEO title={i18n.t('actions.title')} />

      <div className="grid grid-layout-primary">
        <Map />

        <div className="col-span-full md:col-start-7 md:col-span-7 md:pl-10 pb-10 md:pb-36">
          <Form primaryGrid={false} className="grid-cols-6">
            <Row primaryGrid={false} className="md:col-span-5">
              <TextInput name="filter" placeholder={i18n.t('actions.filter')} />
            </Row>
          </Form>

          <ul>
            {Object.keys(actions).map((key, index) => (
              <li
                key={`action-date-${index}`}
                className={`${index > 0 && 'mt-20'}`}
              >
                <FederalCountry
                  count={`${actions[key].length}`}
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
  const { initialState, ...globalData } = await queryGlobalData(locale);

  return {
    // TODO: find a good magic number here
    revalidate: 60,
    props: {
      actions,
      ...globalData,
      initialState
    }
  };
}
