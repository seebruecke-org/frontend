export { default } from './Image';
export { default as transform } from './transform';

export const FRAGMENT = `
  ... on CoreImageBlock {
    attributes {
      ... on CoreImageBlockAttributes {
        id
        caption
      }
    }
  }
`;
