import FRAGMENT_LINK from '@/components/StrapiLink/fragment';

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

export async function sideloadData(
  { cta, filter, max_actions_to_show },
  formatting,
  options
) {
  const { buildGraphQLQuery, formatTime } = await import('@/lib/actions');
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
      'end',
      'slug',
      'location',
      'location_detail',
      'coordinates'
    ],
    filter,
    max_actions_to_show
  );

  const { actions = [] } = await fetchAPI(query, options);
  const endrichedActions =
    actions &&
    actions.map(({ coordinates, start, end, ...action }) => ({
      ...action,
      start: formatTime(start, formatting.dateTime),
      end: formatTime(end, formatting.dateTime),
      coordinates: toMapboxCoordinates(coordinates)
    }));

  return {
    cta: cta?.link ? await fetchLink(cta?.link, options) : null,
    actions: endrichedActions || []
  };
}

export default {
  name: 'Actions',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
