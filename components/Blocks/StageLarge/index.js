import StageLarge from './StageLarge';
import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';
import { FRAGMENT as FRAGMENT_HEADING } from '@/components/Heading';

export default StageLarge;

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageLarge {
    title {
      ${FRAGMENT_HEADING}
    }

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

async function sideloadData({ cta, subnavigation }) {
  const { fetchLink } = await import('@/lib/link');

  return {
    cta: cta && (await fetchLink(cta.link)),
    subnavigation: await Promise.all(
      subnavigation.map(({ link }) => fetchLink(link))
    )
  };
}

export const block = {
  name: 'StageLarge',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
