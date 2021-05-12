import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';
import Actions from './Actions';

export default Actions;

export const FRAGMENT = `
  ... on ComponentSharedBlocksActions {
    max_actions_to_show
    show_map

    filter {
      connect_via
      value
      key
    }

    cta {
      ${FRAGMENT_LINK}
    }
  }
`;

export async function sideloadData({ cta, filter, max_actions_to_show }) {
  const { buildGraphQLQuery } = await import('@/lib/actions');
  const { toMapboxCoordinates } = await import('@/lib/coordinates');
  const { fetchAPI } = await import('@/lib/api');
  const { fetchLink } = await import('@/lib/link');

  const query = buildGraphQLQuery(
    [
      'id',
      'title',
      'slug',
      'intro',
      'start',
      'slug',
      'location',
      'location_detail',
      'coordinates'
    ],
    filter,
    max_actions_to_show
  );

  const { actions = [] } = await fetchAPI(query);

  return {
    cta: cta?.link ? await fetchLink(cta?.link) : null,
    actions: actions.map(({ coordinates, ...action }) => ({
      ...action,
      coordinates: toMapboxCoordinates(coordinates)
    }))
  };
}

export const block = {
  name: 'Actions',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
