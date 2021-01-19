export { default } from './Material';

export const FRAGMENT = `
  ... on ComponentSharedBlocksMaterial {
    item {
      id
      external_link
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
