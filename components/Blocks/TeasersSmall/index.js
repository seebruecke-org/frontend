import TeasersSmall from './TeasersSmall';

export default TeasersSmall;

export const FRAGMENT = `
  ... on ComponentSharedBlocksTeasersSmall {
    items {
      title
      tsType: type
      link
    }
  }
`;

export const block = {
  name: 'TeasersSmall',
  Component: TeasersSmall,
  Fragment: FRAGMENT
};
