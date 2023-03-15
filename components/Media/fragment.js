export default `
  ... on ComponentHelperBlocksMedia {
    caption

    media {data{attributes{
      ... on UploadFile {
        caption
        url
        width
        height
        alternativeText
      }}}
    }
  }
`;
