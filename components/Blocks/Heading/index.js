export { default } from './Heading';

export const FRAGMENT = `
  ... on CoreHeadingBlock {
    attributes {
      ... on CoreHeadingBlockAttributes {
        level
        content
      }
    }
  }
`;
