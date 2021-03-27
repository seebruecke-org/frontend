export { default } from './Accordion';

export const FRAGMENT = `
  ... on ComponentSharedBlocksAccordion {
    items {
      title
      content
    }
  }
`;
