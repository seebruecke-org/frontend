import { fetchAPI } from '@/lib/api';

export { default } from './Actions';

export const FRAGMENT = `
  ... on ComponentSharedBlocksActions {
    max_actions_to_show
    show_map

    city {
      name
    }

    cta {
      path
      label
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
