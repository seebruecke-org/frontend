import Material from './Material';

export default Material;

export const FRAGMENT = `
  ... on ComponentSharedBlocksMaterial {
    mTitle: title

    items {
      id
      external_link
      name
      description
      file {
        name
        mime
        size
        url
      }
    }
  }
`;

export const block = {
  name: 'Material',
  Component: Material,
  Fragment: FRAGMENT
};
