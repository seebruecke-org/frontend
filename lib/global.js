import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { fetchAPI } from './api';
import LINK_FRAGMENT from '@/components/StrapiLink/fragment';

async function getTranslations(locale, scope = []) {
  return await serverSideTranslations(locale, [
    'common',
    'format',
    'slugs',
    ...scope
  ]);
}

async function queryMenus(locale, options) {
  let {
    menu: { menus }
  } = await fetchAPI(
    `
    query Menus {
      menu(locale: "${locale}") {data{attributes{
        menus: menu {
          title
          location
          items {
            ${LINK_FRAGMENT}
          }
        }
      }}}
    }
  `,
    options
  );

  return await menus.reduce(async (accP, menu) => {
    const acc = await accP;
    const { location, items, ...rest } = menu;

    acc[location] = {
      ...rest,
      items: items
    };

    return acc;
  }, Promise.resolve({}));
}

export async function query(locale, scope = [], options) {
  const menus = await queryMenus(locale, options);
  const translations = await getTranslations(locale, scope);

  return {
    initialState: {
      menus
    },
    ...translations
  };
}
