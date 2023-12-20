export const FRAGMENT = `
  ... on ComponentSharedBlocksContact {
    facebook
    instagram
    twitter
    youtube

    email
    telephone
    mastodon
    bluesky
  }
`;

export default {
  name: 'Contact',
  Fragment: FRAGMENT
};
