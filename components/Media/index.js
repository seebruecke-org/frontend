export { default } from './Media';

export const FRAGMENT = `
  ... on ComponentHelperBlocksMedia {
    description: caption

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
