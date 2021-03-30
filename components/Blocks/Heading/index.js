import Heading from './Heading';

export default Heading;

export const FRAGMENT = `
  ... on ComponentSharedBlocksHeading {
    level
    text
    kicker
  }
`;

export const block = {
  name: 'Heading',
  Component: Heading,
  Fragment: FRAGMENT
};
