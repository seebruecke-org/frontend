import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { fetchAPI } from './api';

import { fetchLink } from './link';
import { FRAGMENT as LINK_FRAGMENT } from '@/components/StrapiLink';

let TRANSLATIONS = {};
let MENUS = null;

async function getTranslations(locale) {
  if (TRANSLATIONS[locale]) {
    return TRANSLATIONS[locale];
  }

  TRANSLATIONS[locale] = await serverSideTranslations(locale, ['common']);

  return TRANSLATIONS;
}

async function queryMenus() {
  if (MENUS) {
    return MENUS;
  }

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

  MENUS = await menus.reduce(async (accP, menu) => {
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

  return MENUS;
}

export async function query(locale) {
  const menus = await queryMenus();
  const translations = await getTranslations(locale);

  return {
    initialState: {
      menus
    },
    ...translations
  };
}
