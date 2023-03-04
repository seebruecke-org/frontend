export const FRAGMENT = `
  ... on ComponentSharedBlocksAccordion {
    csba_items:items {
      title
      content
    }
  }
`;

export default {
  name: 'Accordion',
  Fragment: FRAGMENT
};
