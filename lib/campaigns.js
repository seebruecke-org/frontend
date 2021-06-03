import { fetchAPI } from './api';
import { getFragments, sideloadBlockData } from '@/components/Blocks';

export async function fetchCampaignBySlug(slug) {
  const { campaigns } = await fetchAPI(`
    query SingleCampaign {
      campaigns(where: { slug: "${slug}"}) {
        title

        content {
          __typename

          ${getFragments({
            exclude: ['Newsletter', 'Fundraisingbox', 'SubNavigation']
          })}
        }
      }
    }
  `);

  return {
    data: await sideloadBlockData(campaigns[0] || null, 'content')
  };
}

export async function fetchAllPaths() {
  const { campaigns } = await fetchAPI(`
    query CampaignPaths {
      campaigns {
        slug
      }
    }
  `);

  return campaigns.map(({ slug }) => ({
    locale: 'de',
    params: {
      slug: [slug]
    }
  }));
}
