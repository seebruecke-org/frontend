import FRAGMENT_LINK from '@/components/StrapiLink/fragment';

export const FRAGMENT = `
  ... on ComponentSharedBlocksTeaserLarge {
    title
    intro
    tType: type
    cta {
      ${FRAGMENT_LINK}
    }
  }
`;

export async function sideloadData({ cta }, formatting, options) {
  const { fetchLink } = await import('@/lib/link');

  return {
    cta: await fetchLink(cta?.link, options)
  };
}

export default {
  name: 'TeaserLarge',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
