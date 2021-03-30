import Richtext from './Richtext';

export default Richtext;

export const FRAGMENT = `
  ... on ComponentSharedBlocksRichtext {
    richtext
  }
`;

export const block = {
  name: 'Richtext',
  Component: Richtext,
  Fragment: FRAGMENT
};
