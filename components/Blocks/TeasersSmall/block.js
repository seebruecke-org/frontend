export const FRAGMENT = `
  ... on ComponentSharedBlocksTeasersSmall {
    items {
      title
      tsType: type
      link
    }
  }
`;

export async function sideloadData({ items }) {
  const { fetchLink } = await import('@/lib/link');

  if (!items) {
    return items;
  }

  return {
    items: await Promise.all(
      items.map(async (item) => ({
        ...item,
        link: await fetchLink(item.link)
      }))
    )
  };
}

export default {
  name: 'TeasersSmall',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
