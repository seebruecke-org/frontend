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

async function queryMenus(locale, options) {
  let {
    menu: { menus }
  } = await fetchAPI(
    `
    query Menus {
      menu(locale: "${locale}") {
        menus: menu {
          title
          location
          items {
            ${LINK_FRAGMENT}
          }
        }
      }
    }
  `,
    options
  );

  return await menus.reduce(async (accP, menu) => {
    const acc = await accP;
    const { location, items, ...rest } = menu;
    const itemsWithLinks = await Promise.all(
      items.map(({ link }) => fetchLink(link, options))
    );

    acc[location] = {
      ...rest,
      items: itemsWithLinks
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
