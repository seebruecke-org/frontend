import Contact from './Contact';

export default Contact;

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

export const block = {
  name: 'Contact',
  Fragment: FRAGMENT
};
