import METADATA_FRAGMENT from '@/components/SEO/fragment';
import { extractImage, mergeMetadata } from '@/lib/metadata';
import { fetchAPI } from './api';
import { getFragments, sideloadBlockData } from '@/components/Blocks';

export async function fetchCampaignBySlug(slug, locale, formatting, options) {
  const { campaigns } = await fetchAPI(
    `
    query SingleCampaign {
      campaigns(where: { slug: "${slug}"}, locale: "${locale}") {
        title

        content {
          __typename

          ${getFragments({
            exclude: ['Newsletter', 'Fundraisingbox', 'SubNavigation']
          })}
        }

        metadata {
          ${METADATA_FRAGMENT}
        }
      }
    }
  `,
    options
  );

  const campaign = campaigns[0] || null;

  if (campaign) {
    const contentImage = extractImage(campaign?.content);

    campaign.metadata = mergeMetadata(campaign.metadata, {
      title: campaign.title,
      facebook_image: contentImage && `${contentImage}&size=facebook`,
      twitter_image: contentImage && `${contentImage}&size=twitter`
    });
  }

  return {
    data: await sideloadBlockData(campaign, 'content', formatting, {}, locale)
  };
}

export async function fetchAllPaths(locale, options) {
  const { campaigns } = await fetchAPI(
    `
    query CampaignPaths {
      campaigns {
        slug
      }
    }
  `,
    options
  );

  return campaigns.map(({ slug }) => ({
    locale,
    params: {
      slug: [slug]
    }
  }));
}
