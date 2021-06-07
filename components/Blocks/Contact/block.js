export const FRAGMENT = `
  ... on ComponentSharedBlocksContact {
    facebook
    instagram
    twitter
    youtube

    email
    telephone
  }
`;

export default {
  name: 'Contact',
  Fragment: FRAGMENT
};
