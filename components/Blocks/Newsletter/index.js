import Newsletter from './Newsletter';

export default Newsletter;

export const FRAGMENT = `
  ... on ComponentSharedBlocksNewsletter {
    title
    intro
  }
`;

export const block = {
  name: 'Newsletter',
  Fragment: FRAGMENT
};
