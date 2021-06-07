export const FRAGMENT = `
  ... on ComponentSharedBlocksAccordion {
    items {
      title
      content
    }
  }
`;

export default {
  name: 'Accordion',
  Fragment: FRAGMENT
};
