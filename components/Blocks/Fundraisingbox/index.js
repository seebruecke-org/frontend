import Fundraisingbox from './Fundraisingbox';

export default Fundraisingbox;

export const FRAGMENT = `
  ... on ComponentSharedBlocksFundraisingbox {
    script_url
  }
`;

export const block = {
  name: 'Fundraisingbox',
  Component: Fundraisingbox,
  Fragment: FRAGMENT
};
