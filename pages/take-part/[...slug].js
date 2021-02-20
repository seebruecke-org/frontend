import { RETURN_CODES } from '@/lib/constants';
import { query, fetchAllGroupPaths } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { useI18n } from 'next-localization';

import { StageMedium } from '@/components/Stages';
import BlockSwitch from '@/components/BlockSwitch';
import SectionNavigation from '@/components/SectionNavigation';

export default function TakePartPage({
  name,
  group,
  safe_harbour,
  navigation,
  pageType
}) {
  const i18n = useI18n();
  const featuredImage =
    pageType === 'group'
      ? group?.featured_image?.image
      : safe_harbour?.featured_image?.image;

  return (
    <article className="grid grid-layout-primary">
      <StageMedium
        title={name}
        kicker={i18n.t(
          pageType === 'group' ? 'group.singleTitle' : 'safeHarbour.singleTitle'
        )}
        className="col-span-full"
        image={featuredImage}
      />

      {navigation && navigation.length > 1 && (
        <SectionNavigation items={navigation} className="col-span-full" />
      )}

      <BlockSwitch blocks={group?.content} className="col-span-full" />
    </article>
  );
}

export async function getStaticPaths() {
  const paths = await fetchAllGroupPaths();

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ locale, params }) {
  const { slug } = params;
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
