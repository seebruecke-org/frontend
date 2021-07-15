import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { RETURN_CODES } from '@/lib/constants';
import { getLastBlockName } from '@/lib/blocks';
import {
  query,
  fetchAllGroupPaths,
  fetchAllCountryPaths,
  fetchAllFederalCountryPaths
} from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { useTranslation } from 'next-i18next';
import BlockSwitch from '@/components/BlockSwitch';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';
import StageMedium from '@/components/Stages/Medium';

const Actions = dynamic(() => import('@/components/Blocks/Actions'));
const Breadcrumbs = dynamic(() => import('@/components/Blocks/Breadcrumbs'));
const Demands = dynamic(() => import('@/components/Demands/SafeHarbour'));
const SectionNavigation = dynamic(() =>
  import('@/components/SectionNavigation')
);

export default function TakePartPage({
  breadcrumbs,
  name,
  group,
  content,
  demands,
  federal_country,
  safe_harbour,
  navigation,
  pageType
}) {
  const { t } = useTranslation('safe-harbour');
  const { t: tg } = useTranslation('group');
  const { t: ts } = useTranslation('slugs');
  const { ref: refStage, inView: inViewStage } = useInView({
    threshold: 0,
    initialInView: true
  });

  const isGroup = pageType === 'group';
  const isSafeHarbour = pageType === 'safe-harbour';
  const isCountry = pageType === 'country';
  const hasNavigation = navigation && navigation.length > 1;
  const contentBlocks = group?.content || safe_harbour?.content || content;
  let kicker = isGroup ? tg('singleTitle') : t('singleTitle');
  const featuredImage = isGroup ? group?.image : safe_harbour?.image;
  const hasAnchorNavigation =
    (isGroup && group?.actions?.length > 0 && group?.headlines?.length > 0) ||
    (group?.actions?.length === 0 && group?.headlines?.length > 1);
  const pageTitlePrefix = isCountry ? '' : kicker;

  if (!isGroup && safe_harbour?.since) {
    kicker += ` · ${t('since').toLowerCase()} ${safe_harbour.since} `;
  }

  return (
    <PageBody
      firstBlock="StageMedium"
      lastBlock={getLastBlockName(contentBlocks)}
      className="grid grid-layout-primary"
    >
      <SEO title={`${pageTitlePrefix} ${name}`} />

      {!isCountry && Array.isArray(breadcrumbs) && (
        <Breadcrumbs
          crumbs={[
            ...(isGroup
              ? [
                  {
                    url: `/${ts('take-part/all-groups')}`,
                    label: `${tg('pluralTitle')}`
                  }
                ]
              : []),

            ...(isSafeHarbour
              ? [
                  {
                    url: `/${ts('safe-harbours/all-harbours')}`,
                    label: `${t('pluralTitle')}`
                  }
                ]
              : []),
            ...breadcrumbs
          ]}
        />
      )}

      {isGroup || isSafeHarbour ? (
        <StageMedium
          title={name}
          kicker={kicker}
          className="col-span-full"
          image={featuredImage}
          allowBookmark
          ref={refStage}
        />
      ) : (
        <Heading level={1} kicker="Seebrücke">
          {name}
        </Heading>
      )}

      {hasNavigation && (
        <SectionNavigation
          items={navigation}
          className="col-span-full"
          alwaysShowBorder={isGroup || isSafeHarbour}
        />
      )}

      {hasAnchorNavigation && (
        <div
          className={clsx(
            'col-span-full sticky top-0 z-30',
            inViewStage && 'hidden'
          )}
        >
          <SectionNavigation
            items={[
              ...(group.actions.length > 0
                ? [
                    {
                      url: '#aktionen',
                      label: tg('upcomingActions')
                    }
                  ]
                : []),
              ...group.headlines
            ]}
            className="col-span-full"
          />
        </div>
      )}

      {isGroup && group?.actions && group.actions.length > 0 && (
        <>
          <Heading level={2} id="aktionen" scrollMargin={hasAnchorNavigation}>
            {tg('upcomingActions')}
          </Heading>
          <Actions actions={group.actions} />
        </>
      )}

      {(demands || safe_harbour?.demands) && (
        <>
          <Heading level={2} scrollMargin={hasAnchorNavigation}>
            {tg('ourDemands')}
          </Heading>
          <Demands
            demands={demands || safe_harbour?.demands}
            cityName={name}
            federalCountryName={federal_country?.name}
          />
        </>
      )}

      <BlockSwitch
        blocks={contentBlocks}
        className="col-span-full"
        scrollMargin={hasAnchorNavigation}
      />
    </PageBody>
  );
}

export async function getStaticPaths({ defaultLocale }) {
  const groupPaths = await fetchAllGroupPaths(defaultLocale);
  const countryPaths = await fetchAllCountryPaths(defaultLocale);
  const federalCountryPaths = await fetchAllFederalCountryPaths(defaultLocale);

  return {
    fallback: true,
    paths: [...groupPaths, ...countryPaths, ...federalCountryPaths]
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const { initialState, ...globalData } = await queryGlobalData(locale, [
    'safe-harbour',
    'group'
  ]);
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const { type, data, ...res } = await query(slug, locale, format);

  if (type === RETURN_CODES.REDIRECT) {
    return {
      redirect: {
        destination: res.destination,
        permanent: true
      }
    };
  }

  if (data === null) {
    return {
      notFound: true
    };
  }

  return {
    revalidate: 60 * 60,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
