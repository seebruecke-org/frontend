export { default } from './SEO';

export const FRAGMENT = `
  ... on ComponentSeoSeoSmo {
    twitter_title
    twitter_description
    twitter_image {
      url
    }

    facebook_title
    facebook_description
    facebook_image {
      url
    }

    description
  }
`;
