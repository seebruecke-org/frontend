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
  safe_harbour,
  navigation,
  pageType
}) {
  const { t } = useTranslation();
  const isGroup = pageType === 'group';
  const contentBlocks = group?.content || safe_harbour?.content || content;
  const kicker = t(isGroup ? 'group.singleTitle' : 'safeHarbour.singleTitle');
  const featuredImage = isGroup
    ? group?.image?.image
    : safe_harbour?.image?.image;

  return (
    <PageBody
      firstBlock="StageMedium"
      lastBlock={getLastBlockName(contentBlocks)}
      className="grid grid-layout-primary"
    >
      <SEO title={`${kicker} ${name}`} />

      {pageType !== 'country' && <Breadcrumbs crumbs={breadcrumbs} />}

      {pageType === 'group' || pageType === 'safe-harbour' ? (
        <StageMedium
          title={name}
          kicker={`${kicker}${
            pageType === 'safe-harbour' &&
            ` ${t('safeHarbour.since')}${safe_harbour?.since}`
          }`}
          className="col-span-full"
          image={featuredImage}
          allowBookmark
        />
      ) : (
        <Heading level={1} kicker="Seebrücke">
          {name}
        </Heading>
      )}

      {navigation && navigation.length > 1 && (
        <SectionNavigation items={navigation} className="col-span-full" />
      )}

      {!isGroup && safe_harbour?.demands && (
        <>
          <Heading level={2}>Unsere Forderungen</Heading>
          <Demands demands={safe_harbour?.demands} cityName={name} />
        </>
      )}

      <BlockSwitch blocks={contentBlocks} className="col-span-full" />
    </PageBody>
  );
}

export async function getStaticPaths() {
  const groupPaths = await fetchAllGroupPaths();
  const countryPaths = await fetchAllCountryPaths();
  const federalCountryPaths = await fetchAllFederalCountryPaths();

  groupPaths.forEach(({ params: { slug } }) =>
    console.log(`Group: ${slug.join('/')}`)
  );
  countryPaths.forEach(({ params: { slug } }) =>
    console.log(`Country: ${slug.join('/')}`)
  );
  federalCountryPaths.forEach(({ params: { slug } }) =>
    console.log(`Federal Country: ${slug.join('/')}`)
  );

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
    revalidate: 60,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
