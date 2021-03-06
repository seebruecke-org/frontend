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
