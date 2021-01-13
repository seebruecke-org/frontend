import { fetchAPI } from './api';

import { MENU_LOCATIONS } from './constants';
import { FRAGMENT as MENU_ITEM_FRAGMENT } from '@/components/MenuItem';

async function getTranslations(locale) {
  const { default: lngDict = {} } = await import(`../locales/${locale}.json`);

  return lngDict;
}

async function queryMenus(locale) {
  const locations = MENU_LOCATIONS[locale] || null;

  if (!locations) {
    throw new Error(`Menu locations for ${locale} are not defined.`);
  }

  const query = Object.keys(locations).map(
    (name) => `
    ${name}: menus(where: {location: ${locations[name]}}) {
      nodes {
        name
        items: menuItems {
          nodes {
            ...MenuItem
          }
        }
      }
    }
  `
  );

  let data = await fetchAPI(`
    ${MENU_ITEM_FRAGMENT}

    query Menu {
      ${query}
    }
  `);

  // Simplify the response
  data = Object.keys(data).reduce((acc, menuKey) => {
    const menu = data[menuKey];

    acc[menuKey] = menu?.nodes[0];

    return acc;
  }, {});

  return data;
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
