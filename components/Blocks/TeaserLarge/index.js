import TeaserLarge from './TeaserLarge';
import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';
import { fetchLink } from '@/lib/link';

export default TeaserLarge;

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
  return {
    cta: await fetchLink(cta?.link)
  };
}

export const block = {
  name: 'TeaserLarge',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
