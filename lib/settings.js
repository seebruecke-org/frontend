import { fetchAPI } from './api';

export async function getSettings(locale, options) {
  const { setting } = await fetchAPI(
    `
    query Settings {
      setting(locale: "${locale}") {data{attributes{
        homepage {data{attributes{
          slug
        }}}
      }}}
    }
  `,
    options
  );

  return setting;
}
