const path = require('path');
const withPlugins = require('next-compose-plugins');
const transpileModules = require('next-transpile-modules');
const withModules = transpileModules(['html-react-parser']);

module.exports = withPlugins([withModules], {
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'de',
    localeDetection: false
  },

  async rewrites() {
    return [
      {
        source: '/mach-mit/:path*',
        destination: '/take-part/:path*'
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
    WP_GRAPHQL_API: process.env.NEXT_WP_GRAPHQL_API
  }
});
