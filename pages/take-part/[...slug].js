import { RETURN_CODES } from '@/lib/constants';
import { query, fetchAllGroupPaths } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { useI18n } from 'next-localization';

import { StageMedium } from '@/components/Stages';
import BlockSwitch from '@/components/BlockSwitch';
import Demands from '@/components/Demands/SafeHarbour';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SectionNavigation from '@/components/SectionNavigation';
import SEO from '@/components/SEO';

import { getLastBlockName } from '@/lib/blocks';

export default function TakePartPage({
  name,
  group,
  safe_harbour,
  navigation,
  pageType
}) {
  const i18n = useI18n();
  const isGroup = pageType === 'group';
  const contentBlocks = isGroup ? group?.content : safe_harbour?.content;
  const kicker = i18n.t(
    isGroup ? 'group.singleTitle' : 'safeHarbour.singleTitle'
  );
  const featuredImage = isGroup
    ? group?.featured_image?.image
    : safe_harbour?.featured_image?.image;

  return (
    <PageBody
      firstBlock="StageMedium"
      lastBlock={getLastBlockName(contentBlocks)}
      className="grid grid-layout-primary"
    >
      <SEO title={`${kicker} ${name}`} />

      <StageMedium
        title={name}
        kicker={kicker}
        className="col-span-full"
        image={featuredImage}
      />

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
  const paths = await fetchAllGroupPaths();

  return {
    fallback: true,
    paths
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
