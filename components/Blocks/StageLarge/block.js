import FRAGMENT_LINK from '@/components/StrapiLink/fragment';
import { FRAGMENT as FRAGMENT_HEADING } from '@/components/Blocks/Heading/block';
import FRAGMENT_MEDIA from '@/components/Media/fragment';

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

async function sideloadData(
  { cta, subnavigation },
  formatting,
  options,
  locale
) {
  const { fetchLink } = await import('@/lib/link');

  return {
    cta: cta && (await fetchLink(cta.link, options, locale)),
    subnavigation: await Promise.all(
      subnavigation.map(({ link }) => fetchLink(link, options, locale))
    )
  };
}

export default {
  name: 'StageLarge',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
