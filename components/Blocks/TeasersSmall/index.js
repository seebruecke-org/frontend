export { default } from './TeasersSmall';

export const FRAGMENT = `
  ... on ComponentSharedBlocksTeasersSmall {
    items {
      title
      tsType: type
      link
    }
  }
`;
