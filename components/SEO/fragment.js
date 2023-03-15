export default `
  ... on ComponentSeoSeoSmo {
    twitter_title
    twitter_description
    twitter_image {data{attributes{
      url
    }}}

    facebook_title
    facebook_description
    facebook_image {data{attributes{
      url
    }}}

    description
  }
`;
