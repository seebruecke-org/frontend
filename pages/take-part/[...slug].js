import { RETURN_CODES } from '../../lib/constants';
import { query as queryGlobalData } from '../../lib/global';
import { query, paths } from '../../lib/take-part';

import { StageMedium } from '@/components/Stages';
import BlockSwitch from '@/components/BlockSwitch';
import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';
import SectionNavigation from '@/components/SectionNavigation';
import VStack from '@/components/VStack';

export default function TakePartPage({ city, page, siblings }) {
  return <article>
    <SEO title={`${page.title} ${city.title}`} />

    <Breadcrumbs crumbs={[
      {
        path: '/mach-mit/',
        label: 'Mach Mit'
      },

      {
        path: '/mach-mit/brandenburg/',
        label: 'Brandenburg'
      }
    ]} />

    <VStack gap={20}>
      <section>
        {city && (
          <StageMedium kicker={page.title} title={city.title} image={page?.featuredImage?.node} />
        )}

        {siblings && siblings.length > 1 && (
          <div className="w-full">
            <SectionNavigation items={siblings} />
          </div>
        )}
      </section>

      <BlockSwitch blocks={page.blocks} />
    </VStack>
  </article>
}

export async function getStaticPaths({ defaultLocale }) {
  const sidePaths = await paths();
  const staticPaths = sidePaths.map(({ uri, language }) => {
    return {
      locale: language?.slug ?? defaultLocale,
      params: {
        slug: uri.split('/').slice(2)
      }
    }
  });

  return {
    fallback: true,
    paths: staticPaths
  }
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
    }
  }

  if (data === null) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      ...data,
      ...globalData,

      initialState
    }
  }
}
