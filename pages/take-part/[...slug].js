import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';
import format from 'date-fns/format';

import { RETURN_CODES } from '@/lib/constants';
import {
  query,
  fetchAllGroupPaths,
  fetchAllCountryPaths,
  fetchAllFederalCountryPaths
} from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { useTranslation } from 'next-i18next';
import { StageMedium } from '@/components/Stages';
import Actions from '@/components/Blocks/Actions';
import BlockSwitch from '@/components/BlockSwitch';
import Breadcrumbs from '@/components/Blocks/Breadcrumbs';
import Demands from '@/components/Demands/SafeHarbour';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SectionNavigation from '@/components/SectionNavigation';
import SEO from '@/components/SEO';

import { getLastBlockName } from '@/lib/blocks';

export default function TakePartPage({
  breadcrumbs,
  name,
  group,
  content,
  federal_country,
  safe_harbour,
  navigation,
  pageType
}) {
  const { t } = useTranslation();
  const { ref: refStage, inView: inViewStage } = useInView({
    threshold: 0
  });

  const isGroup = pageType === 'group';
  const hasNavigation = navigation && navigation.length > 1;
  const contentBlocks = group?.content || safe_harbour?.content || content;
  let kicker = t(isGroup ? 'group.singleTitle' : 'safeHarbour.singleTitle');
  const featuredImage = isGroup
    ? group?.image?.image
    : safe_harbour?.image?.image;
  const hasAnchorNavigation =
    (isGroup && group?.actions?.length > 0 && group?.headlines?.length > 0) ||
    (group?.actions?.length === 0 && group?.headlines?.length > 1);

  if (!isGroup && safe_harbour?.since) {
    kicker += ` · ${t('safeHarbour.since').toLowerCase()} ${format(
      new Date(safe_harbour?.since),
      t('safeHarbour.dateFormat')
    )}`;
  }

  return (
    <PageBody
      firstBlock="StageMedium"
      lastBlock={getLastBlockName(contentBlocks)}
      className="grid grid-layout-primary"
    >
      <SEO title={`${kicker} ${name}`} />

      {pageType !== 'country' && <Breadcrumbs crumbs={breadcrumbs} />}

      {isGroup || pageType === 'safe-harbour' ? (
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
        <SectionNavigation items={navigation} className="col-span-full" />
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
                      label: t('group.upcomingActions')
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
            {t('group.upcomingActions')}
          </Heading>
          <Actions actions={group.actions} />
        </>
      )}

      {!isGroup && safe_harbour?.demands && (
        <>
          <Heading level={2} scrollMargin={hasAnchorNavigation}>
            Unsere Forderungen
          </Heading>
          <Demands
            demands={safe_harbour?.demands}
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

export async function getStaticPaths() {
  const groupPaths = await fetchAllGroupPaths();
  const countryPaths = await fetchAllCountryPaths();
  const federalCountryPaths = await fetchAllFederalCountryPaths();

  return {
    fallback: true,
    paths: [...groupPaths, ...countryPaths, ...federalCountryPaths]
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const { type, data, ...res } = await query(slug, locale);
  const { initialState, ...globalData } = await queryGlobalData(locale);

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
    // TODO: find a good magic number here
    revalidate: 20,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
