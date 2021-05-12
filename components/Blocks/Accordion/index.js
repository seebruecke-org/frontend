import Accordion from './Accordion';

export default Accordion;

export const FRAGMENT = `
  ... on ComponentSharedBlocksAccordion {
    items {
      title
      content
    }
  }
`;

export const block = {
  name: 'Accordion',
  Fragment: FRAGMENT
};
