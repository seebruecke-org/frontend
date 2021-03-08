import React from 'react';

import { query as queryGlobalData } from '@/lib/global';
import { query, paths } from '@/lib/pages';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';

import BlockSwitch from '@/components/BlockSwitch';
import Gallery from '@/components/Gallery';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

export default function GenericPage({ page }) {
  return (
    <PageBody
      firstBlock={getFirstBlockName(page?.content)}
      lastBlock={getLastBlockName(page?.content)}
    >
      <SEO title={page?.title} />
      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary">
        <Gallery
          items={[
            {
              media: 'https://dummyimage.com/600x400/000/fff'
            },
            {
              media: 'https://dummyimage.com/600x400/000/0011ff'
            },
            {
              media: 'https://dummyimage.com/600x400/000/fff'
            },
            {
              media: 'https://dummyimage.com/600x400/000/0011ff'
            },
            {
              media: 'https://dummyimage.com/600x400/000/fff'
            },
            {
              media: 'https://dummyimage.com/600x400/000/0011ff'
            }
          ]}
        />
      </div>
    </PageBody>
  );
}

export async function getStaticPaths({ defaultLocale }) {
  const sidePaths = await paths();
  const customPages = [
    'mach-mit',
    'aktionen',
    'aktuelles',
    'sichere-haefen/alle-haefen',
    'presse'
  ];

  const staticPaths = sidePaths
    .map(({ slug, parent }) => {
      const path = [parent?.slug, slug].filter(Boolean);

      if (customPages.includes(path.join('/'))) {
        return null;
      }

      return {
        locale: defaultLocale,
        params: {
          slug: path
        }
      };
    })
    .filter(Boolean);

  return {
    fallback: true,
    paths: staticPaths
  };
}

export async function getStaticProps({ locale, params }) {
  const { slug } = params;

  const { data } = await query(slug, locale);
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

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
