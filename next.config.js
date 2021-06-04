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
const { slugs: slugsDe } = require('./locales/de/common.json');

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

    return redirects
      .map(({ from, to, type }) => {
        const destination = to.startsWith('/') ? `/de${to}` : to;
        let source = from;
        const redirect = [];
        const permanent = type === 'permanently';

        console.log('Redirect', source, destination);

        redirect.push({
          source,
          destination,
          permanent,
          locale: false
        });

        // Create a second redirect either with or without the slash at the
        // end. Ideally this would be a regex, but I couldn't figure out how
        // to do it
        redirect.push({
          source: source.endsWith('/')
            ? source.replace(/\/$/, '')
            : `${source}/`,
          destination,
          permanent,
          locale: false
        });

        return redirect;
      })
      .flat();
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
      domains: getImageHostnames()
    },

    future: {
      webpack5: isProduction()
    }
  }
);
