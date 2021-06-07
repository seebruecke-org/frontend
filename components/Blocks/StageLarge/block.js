import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';
import { FRAGMENT as FRAGMENT_HEADING } from '@/components/Blocks/Heading/block';

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageLarge {
    heading {
      ${FRAGMENT_HEADING}
    }

    intro

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

export default {
  name: 'StageLarge',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
