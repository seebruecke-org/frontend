export { default } from './Image';

export const FRAGMENT = `
  ... on ComponentSharedBlocksMedia {
    media {
      alternativeText
      caption
      width
      height
      url
    }
  }
`;
