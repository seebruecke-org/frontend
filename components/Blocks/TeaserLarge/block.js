import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';

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

export async function sideloadData({ cta }) {
  const { fetchLink } = await import('@/lib/link');

  return {
    cta: await fetchLink(cta?.link)
  };
}

export default {
  name: 'TeaserLarge',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
