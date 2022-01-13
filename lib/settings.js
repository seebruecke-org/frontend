import { fetchAPI } from './api';

export async function getSettings(locale, options) {
  const { setting } = await fetchAPI(
    `
    query {
      setting {
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
