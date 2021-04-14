import Material from './Material';

export default Material;

export const FRAGMENT = `
  ... on ComponentSharedBlocksMaterial {
    mTitle: title

    items {
      id
      external_link
      name
      description
      file {
        name
        mime
        size
        url
      }
    }
  }
`;

export async function sideloadData({ items }) {
  return {
    items: items.map(({ file, ...item }) => ({
      ...item,
      file: {
        ...file,
        url: file?.url ? `${process.env.NEXT_CMS_DOMAIN}${file.url}` : null
      }
    }))
  };
}

export const block = {
  name: 'Material',
  Component: Material,
  Fragment: FRAGMENT,
  sideload: sideloadData
};
