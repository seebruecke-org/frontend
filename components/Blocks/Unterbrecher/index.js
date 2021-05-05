import Unterbrecher from './Unterbrecher';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';
import { FRAGMENT as FRAGMENT_TITLE } from '@/components/Blocks/Heading';
import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';
import { fetchLink } from '@/lib/link';

export default Unterbrecher;

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
  return {
    uCTA: await fetchLink(uCTA?.link)
  };
}

export const block = {
  name: 'Unterbrecher',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
