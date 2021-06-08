import { FRAGMENT as FRAGMENT_TITLE } from '@/components/Blocks/Heading/block';
import FRAGMENT_LINK from '@/components/StrapiLink/fragment';
import FRAGMENT_MEDIA from '@/components/Media/fragment';

export const FRAGMENT = `
  ... on ComponentSharedBlocksUnterbrecher {
    uTitle: title {
      ${FRAGMENT_TITLE}
    }

    intro
    reversed: orientation_reversed
    type
    size

    uCTA: cta {
      ${FRAGMENT_LINK}
    }

    image {
      ${FRAGMENT_MEDIA}
    }
  }
`;

export async function sideloadData({ uCTA }) {
  const { fetchLink } = await import('@/lib/link');

  return {
    uCTA: uCTA?.link ? await fetchLink(uCTA?.link) : null
  };
}

export default {
  name: 'Unterbrecher',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
