const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    localeDetection: false
  },
  react: { useSuspense: false },
  localePath: path.resolve('./locales')
};
