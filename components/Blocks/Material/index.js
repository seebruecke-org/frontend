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
    items: items.map(({ file, ...item }) => {
      if (!file?.url) {
        return {
          ...item,
          file
        };
      }

      return {
        ...item,
        file: {
          ...file,
          url: `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${file.url}`
        }
      };
    })
  };
}

export const block = {
  name: 'Material',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
