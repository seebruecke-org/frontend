import { toMapboxCoordinates } from '@/lib/coordinates';
import { fetchAPI } from '@/lib/api';
import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';
import Actions from './Actions';
import { fetchLink } from '@/lib/link';

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

export async function sideloadData({ cta }) {
  const { actions = [] } = await fetchAPI(`
    query {
      actions(where: { end_gte: "${new Date().toISOString()}" }) {
        id
        title
        slug
        intro
        start
        slug
        location
        location_detail
        coordinates
      }
    }
  `);

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
  Component: Actions,
  Fragment: FRAGMENT,
  sideload: sideloadData
};
