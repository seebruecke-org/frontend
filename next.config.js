const path = require('path');
const withPlugins = require('next-compose-plugins');
const transpileModules = require('next-transpile-modules');
const withModules = transpileModules(['html-react-parser']);
const { request } = require('graphql-request');

const { slugs: slugsDe } = require('./locales/de');

async function fetchAllRedirects() {
  try {
    const { redirects } = await request(
      process.env.NEXT_WP_GRAPHQL_API,
      `
  query {
    redirects {
      from
      to
      type
    }
  }
`
    );

    if (!redirects) {
      return [];
    }

    return redirects.map(({ from, to, type }) => {
      console.log('Create redirect: ', from, ' --> ', to, ' : ', type);

      return {
        source: from,
        destination: to,
        permanent: type === 'permanently'
      };
    });
  } catch {
    return [];
  }
}

function createRewrites(slugs, locale) {
  const PATH_POSTFIXES = {
    'take-part': ':slug*',
    actions: ':path*',
    news: ':path*',
    press: ':path*'
  };

  return Object.keys(slugs).map((key) => {
    const postfix = PATH_POSTFIXES[key] ? `/${PATH_POSTFIXES[key]}` : '';
    const source = `/${locale}/${slugs[key]}${postfix}`;
    const destination = `/${locale}/${key}${postfix.replace(/\(.*\)/, '')}`;

    console.log('Create rewrite: ', source, ' --> ', destination);

    return {
      source,
      destination,
      locale: false
    };
  });
}

module.exports = withPlugins([withModules], {
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
    localeDetection: false
  },

  async rewrites() {
    return [...createRewrites(slugsDe, 'de')];
  },

  async redirects() {
    const redirects = await fetchAllRedirects();

    return redirects;
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
