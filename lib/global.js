import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { fetchAPI } from './api';
import { fetchLink } from './link';
import LINK_FRAGMENT from '@/components/StrapiLink/fragment';

async function getTranslations(locale, scope = []) {
  return await serverSideTranslations(locale, [
    'common',
    'format',
    'slugs',
    ...scope
  ]);
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

export async function query(locale, scope) {
  const menus = await queryMenus(locale);
  const translations = await getTranslations(locale, scope);

  return {
    initialState: {
      menus
    },
    ...translations
  };
}
