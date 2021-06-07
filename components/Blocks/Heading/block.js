export const FRAGMENT = `
  ... on ComponentSharedBlocksHeading {
    level
    text
    kicker
  }
`;

export default {
  name: 'Heading',
  Fragment: FRAGMENT
};
