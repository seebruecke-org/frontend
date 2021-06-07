import FRAGMENT_LINK from '@/components/StrapiLink/fragment';

export const FRAGMENT = `
  ... on ComponentSharedBlocksSubNavigation {
    items {
      ${FRAGMENT_LINK}
    }
  }
`;

export async function sideloadData({ items = [] }) {
  const { fetchLink } = await import('@/lib/link');

  const itemsEnrichted = await Promise.all(
    items.map(({ link }) => fetchLink(link))
  );

  return {
    items: itemsEnrichted
  };
}

export default {
  name: 'SubNavigation',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
