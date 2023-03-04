export const FRAGMENT = `
  ... on ComponentSharedBlocksMaterial {
    mTitle: title

    csbm_items: items {
      id
      external_link
      name
      description
      file {data{attributes{
        name
        mime
        size
        url
      }}}
    }
  }
`;

export async function sideloadData({ csbm_items }) {
  let items = csbm_items
  const { getFullCMSUrl } = await import('@/lib/url');

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
          url: getFullCMSUrl(file.url)
        }
      };
    })
  };
}

export default {
  name: 'Material',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
