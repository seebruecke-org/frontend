export { default } from './SbHeading';

export const FRAGMENT = `
  ... on SbHeadingBlock {
    attributes {
      level
      content
      kicker
    }
  }
`;
