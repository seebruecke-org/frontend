export { default } from './Paragraph';

export const FRAGMENT = `
  ... on CoreParagraphBlock {
    attributes {
      ... on CoreParagraphBlockAttributes {
        content
      }
    }
  }
`;
