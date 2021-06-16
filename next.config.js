const { createClient } = require('urql');
const runtimeCaching = require('next-pwa/cache');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: isProduction()
});
const withPlugins = require('next-compose-plugins');
const withPreact = require('next-plugin-preact');
const withPWA = require('next-pwa');
const withTranspiledModules = require('next-transpile-modules')([
  'react-children-utilities'
]);

const { i18n } = require('./next-i18next.config');
const slugsDe = require('./locales/de/slugs.json');

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function getImageHostnames() {
  return [process.env.NEXT_PUBLIC_IMAGE_HOSTNAME];
}

async function fetchAllRedirects() {
  const client = createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_API
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

    const normalized = redirects.reduce((acc, { from, to, type }) => {
      let source = `${from.startsWith('/en') ? '' : '/de'}${from}`;
      let destination = `${to.startsWith('/en') ? '' : '/de'}${to}`;

      if (destination.endsWith('/')) {
        destination = destination.replace(/\/$/, '');
      }

      if (source.endsWith('/')) {
        source = source.replace(/\/$/, '');
      }

      if (!destination) {
        destination = '/de';
      }

      const redirect = {
        source,
        destination,
        permanent: type === 'permanently',
        locale: false
      };

      if (!acc.has(source)) {
        console.log('Redirect:', source, destination);

        acc.set(source, redirect);
      } else {
        console.error('Invalid Redirect (duplicate):', source);
      }

      return acc;
    }, new Map());

    return Array.from(normalized.values());
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
    console.log('Rewrite:', source, destination)
  );

  return rewrites;
}

module.exports = withPlugins(
  [
    withTranspiledModules,
    withPreact,
    withBundleAnalyzer,
    [
      withPWA,
      {
        pwa: {
          disable: !isProduction(),
          dest: 'public',
          runtimeCaching
        }
      }
    ]
  ],
  {
    i18n,

    async rewrites() {
      return {
        beforeFiles: createRewrites(slugsDe, 'de')
      };
    },

    async redirects() {
      return await fetchAllRedirects();
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
      domains: getImageHostnames(),
      disableStaticImages: true
    }
  }
);
