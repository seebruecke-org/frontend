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
              media:
                'https://images.unsplash.com/photo-1615229998660-29e3cb2232b4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
              media:
                'https://images.unsplash.com/photo-1615307255772-16b37528023a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
            },
            {
              media:
                'https://images.unsplash.com/photo-1611095567219-8fa7d4d8bf48?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1351&q=80'
            },
            {
              media:
                'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
              media:
                'https://images.unsplash.com/photo-1615087574126-f4f3d62d73cf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=637&q=80'
            },
            {
              media:
                'https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80'
            },
            {
              media:
                'https://images.unsplash.com/photo-1615227777158-3de68180af11?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
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
