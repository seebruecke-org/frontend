export const FRAGMENT = `
  ... on ComponentSharedBlocksTeasersSmall {
    items {
      title
      tsType: type
      link
    }
  }
`;

export async function sideloadData({ items }, formatting, options) {
  const { fetchLink } = await import('@/lib/link');

  if (!items) {
    return items;
  }

  return {
    items: await Promise.all(
      items.map(async (item) => ({
        ...item,
        link: await fetchLink(item.link, options)
      }))
    )
  };
}

export default {
  name: 'TeasersSmall',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
