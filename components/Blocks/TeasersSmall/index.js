import TeasersSmall from './TeasersSmall';
import { fetchLink } from '@/lib/link';

export default TeasersSmall;

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
  if (!items) {
    return items;
  }

  return {
    items: await Promise.all(items.map(({ link }) => fetchLink(link)))
  };
}

export const block = {
  name: 'TeasersSmall',
  Component: TeasersSmall,
  Fragment: FRAGMENT,
  sideload: sideloadData
};
