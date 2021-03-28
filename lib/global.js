import { fetchAPI } from './api';

import { MENU_LOCATIONS } from './constants';
import { FRAGMENT as LINK_FRAGMENT } from '@/components/StrapiLink';

async function getTranslations(locale) {
  const { default: lngDict = {} } = await import(`../locales/${locale}.json`);

  return lngDict;
}

async function queryMenus(locale) {
  const locations = MENU_LOCATIONS[locale] || null;

  let data = await fetchAPI(`
    query Menus {
      menu {
        menu {
          title
          location
          items {
            ${LINK_FRAGMENT}
          }
        }
      }
    }
  `);

  const menus = Object.keys(locations).reduce((acc, location) => {
    const menu = data?.menu?.menu.find(
      (menu) => menu.location === locations[location]
    );

    if (menu) {
      acc[location] = menu;
    }

    return acc;
  }, {});

  return menus;
}

export async function query(locale) {
  const menus = await queryMenus(locale);
  const translations = await getTranslations(locale);

  return {
    initialState: {
      menus
    },
    translations
  };
}
