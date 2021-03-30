import StageLarge from './StageLarge';
import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';
import { fetchLink } from '@/lib/link';

export default StageLarge;

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageLarge {
    title

    image {
      ${FRAGMENT_MEDIA}
    }

    cta {
      ${FRAGMENT_LINK}
    }

    subnavigation {
      ${FRAGMENT_LINK}
    }
  }
`;

export async function sideloadData({ cta }) {
  return {
    cta: await fetchLink(cta.link)
  };
}

export const block = {
  name: 'StageLarge',
  Component: StageLarge,
  Fragment: FRAGMENT,
  sideload: sideloadData
};
