export { default } from './Media';

export const FRAGMENT = `
  ... on ComponentHelperBlocksMedia {
    caption

    media {
      ... on UploadFile {
        caption
        url
        width
        height
        alternativeText
      }
    }
  }
`;
