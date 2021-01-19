export { default } from './Image';

export const FRAGMENT = `
  ... on UploadFile {
    caption
    url
    width
    height
    alternativeText
  }
`;
