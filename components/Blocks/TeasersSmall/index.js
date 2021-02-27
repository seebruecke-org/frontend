export { default } from './TeasersSmall';

export const FRAGMENT = `
  ... on ComponentSharedBlocksTeasersSmall {
    items: item {
      title
      path
      label
      tsType: type
    }
  }
`;
