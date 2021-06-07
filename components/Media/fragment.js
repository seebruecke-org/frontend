export default `
  ... on ComponentHelperBlocksMedia {
    caption

    media {
      ... on UploadFile {
        caption
        url
        width
        height
        alternativeText
      }
    }
  }
`;
