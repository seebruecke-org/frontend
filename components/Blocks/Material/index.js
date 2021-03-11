export { default } from './Material';

export const FRAGMENT = `
  ... on ComponentSharedBlocksMaterial {
    title

    items: item {
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
