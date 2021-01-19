export { default } from './Contact';

export const FRAGMENT = `
  ... on ComponentSharedBlocksContact {
    facebook
    instagram
    twitter

    email
    telephone
  }
`;
