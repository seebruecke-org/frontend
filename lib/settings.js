import { fetchAPI } from './api';

export async function getSettings(locale, options) {
  const { setting } = await fetchAPI(
    `
    query Settings {
      setting(locale: "${locale}") {
        homepage {
          slug
        }
      }
    }
  `,
    options
  );

  return setting;
}
