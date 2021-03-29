import { fetchAPI } from './api';

import { fetchLink } from './link';
import { FRAGMENT as LINK_FRAGMENT } from '@/components/StrapiLink';

async function getTranslations(locale) {
  const { default: lngDict = {} } = await import(`../locales/${locale}.json`);

  return lngDict;
}

async function queryMenus() {
  let {
    menu: { menus }
  } = await fetchAPI(`
    query Menus {
      menu {
        menus: menu {
          title
          location
          items {
            ${LINK_FRAGMENT}
          }
        }
      }
    }
  `);

  return await menus.reduce(async (accP, menu) => {
    const acc = await accP;
    const { location, items, ...rest } = menu;
    const itemsWithLinks = await Promise.all(
      items.map(({ link }) => fetchLink(link))
    );

    acc[location] = {
      ...rest,
      items: itemsWithLinks
    };

    return acc;
  }, Promise.resolve({}));
}

export async function query(locale) {
  const menus = await queryMenus();
  const translations = await getTranslations(locale);

  return {
    initialState: {
      menus
    },
    translations
  };
}
