export const FRAGMENT = `
  ... on ComponentSharedBlocksContact {
    facebook
    instagram
    twitter
    youtube

    email
    telephone
    mastodon
  }
`;

export default {
  name: 'Contact',
  Fragment: FRAGMENT
};
