const { createClient } = require('urql');

const withPlugins = require('next-compose-plugins');
const withTranspiledModules = require('next-transpile-modules')([
  'react-children-utilities'
]);

const { i18n } = require('./next-i18next.config');
const { slugs: slugsDe } = require('./locales/de/common.json');

async function fetchAllRedirects() {
  const client = createClient({
    url: process.env.NEXT_WP_GRAPHQL_API
  });

  try {
    const { redirects } = await client
      .query(
        `
    query {
      redirects {
        from
        to
        type
      }
    }
  `
      )
      .toPromise()
      .then(({ data }) => data);

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
    // eslint-disable-next-line no-useless-escape
    'take-part': ':slug*',
    actions: ':slug',
    news: ':slug',
    'news/campaigns': ':slug',
    press: ':slug'
  };

  const rewrites = Object.keys(slugs)
    .map((key) => {
      const postfix = PATH_POSTFIXES[key] ? `/${PATH_POSTFIXES[key]}` : '';
      const source = `/${locale}/${slugs[key]}${postfix}`;
      const destination = `/${locale}/${key}${postfix.replace(/\(.*\)/, '')}`;

      const rewrite = [];

      // TODO: remove hard coded take-part condition
      if (postfix) {
        rewrite.push({
          source: `/${locale}/${slugs[key]}`,
          destination: `/${locale}/${key}`,
          locale: false
        });
      }

      rewrite.push({
        source,
        destination,
        locale: false
      });

      return rewrite;
    })
    .flat();

  rewrites.forEach(({ source, destination }) =>
    console.log('Create rewrite: ', source, ' --> ', destination)
  );

  return rewrites;
}

module.exports = withPlugins([withTranspiledModules], {
  i18n,

  async rewrites() {
    return {
      beforeFiles: createRewrites(slugsDe, 'de')
    };
  },

  async redirects() {
    const redirects = await fetchAllRedirects();

    return redirects;
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
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
