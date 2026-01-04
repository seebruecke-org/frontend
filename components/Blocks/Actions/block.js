import FRAGMENT_LINK from "@/components/StrapiLink/fragment";

export const FRAGMENT = `
  ... on ComponentSharedBlocksActions {
    max_actions_to_show
    show_map

    filter {
      connect_via
      value
      key
    }

    actionsCTA: cta {
      ${FRAGMENT_LINK}
    }
  }
`;

export async function sideloadData(
  { actionsCTA, filter, max_actions_to_show },
  formatting,
  options,
  locale
) {
  const { buildGraphQLQuery, formatTime } = await import('@/lib/actions');
  const { toMapboxCoordinates } = await import('@/lib/coordinates');
  const { fetchAPI } = await import('@/lib/api');

  const query = buildGraphQLQuery(
    [
      'title',
      'slug',
      'intro',
      'start',
      'hide_start_time',
      'end',
      'slug',
      'location',
      'location_detail',
      'coordinates'
    ],
    filter,
    max_actions_to_show,
    locale
  );

  const { actions = [] } = await fetchAPI(query, options);
  const endrichedActions =
    actions &&
    actions.map(({ coordinates, start, hide_start_time, end, ...action }) => ({
      ...action,
      start: formatTime(start, hide_start_time ? formatting.date : formatting.dateTime),
      end: formatTime(end, formatting.dateTime),
      coordinates: toMapboxCoordinates(coordinates)
    }));

  return {
    actionsCTA: actionsCTA,
    actions: endrichedActions || []
  };
}

export default {
  name: 'Actions',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
