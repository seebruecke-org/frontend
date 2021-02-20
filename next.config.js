const path = require('path');
const withPlugins = require('next-compose-plugins');
const transpileModules = require('next-transpile-modules');
const withModules = transpileModules(['html-react-parser']);

module.exports = withPlugins([withModules], {
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
    localeDetection: false
  },

  async rewrites() {
    return [
      {
        source: '/de/mach-mit/:slug*',
        destination: '/de/take-part/:slug*',
        locale: false
      },

      {
        source: '/de/aktionen/:path*',
        destination: '/de/actions/:path*',
        locale: false
      },

      {
        source: '/de/sichere-haefen/alle-haefen',
        destination: '/de/safe-harbours/all-harbours',
        locale: false
      }
    ];
  },

  webpack(config) {
    config.resolve.alias['react'] = path.resolve(
      __dirname,
      '.',
      'node_modules',
      'react'
    );

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/
      },
      use: ['@svgr/webpack']
    });

    return config;
  },

  images: {
    domains: [process.env.NEXT_IMAGE_HOSTNAME]
  },

  env: {
    NEXT_CMS_DOMAIN: process.env.NEXT_CMS_DOMAIN,
    WP_GRAPHQL_API: process.env.NEXT_WP_GRAPHQL_API,
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN
  }
});
