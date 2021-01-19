export { default } from './Accordion';

export const FRAGMENT = `
  ... on ComponentSharedBlocksAccordion {
    item {
      title
      content
    }
  }
`;
