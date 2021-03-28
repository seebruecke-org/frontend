import { fetchAPI } from '@/lib/api';

import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';

export { default } from './Actions';

export const FRAGMENT = `
  ... on ComponentSharedBlocksActions {
    max_actions_to_show
    show_map

    cta {
      ${FRAGMENT_LINK}
    }
  }
`;

export async function sideloadData() {
  const { actions } = await fetchAPI(`
    query {
      actions {
        title
        slug
        intro
        start
        slug
        location
        location_detail
      }
    }
  `);

  return {
    actions
  };
}
