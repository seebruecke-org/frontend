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

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function getImageHostnames() {
  return [process.env.NEXT_PUBLIC_IMAGE_HOSTNAME];
}

function normalizeRedirect(url) {
  let normalizedUrl = url;

  if (normalizedUrl.startsWith('http')) {
    return url;
  }

  if (!normalizedUrl.startsWith('/en')) {
    normalizedUrl = `/de${normalizedUrl}`;
  }

  normalizedUrl = normalizedUrl.replace('?', `\\?`);

  if (normalizedUrl.endsWith('/')) {
    normalizedUrl = normalizedUrl.replace(/\/$/, '');
  }

  return normalizedUrl;
}

function getStaticRedirects() {
  return [
    {
      source: '/de/wp-content/:path*',
      destination: `${process.env.NEXT_PUBLIC_CMS_DOMAIN}/wp-content/:path*`,
      permanent: true,
      locale: false
    },

    {
      source: '/de/mailman/:path*',
      destination: 'http://mail.seebruecke.org/mailman/:path*',
      permanent: true,
      locale: false
    },

    {
      source: '/de/uploads/:path*',
      destination: `${process.env.NEXT_PUBLIC_CMS_DOMAIN}/uploads/:path*`,
      permanent: true,
      locale: false
    }
  ];
}

async function fetchAllRedirects() {
  const client = createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_API
  });

  try {
    const { redirects } = await client
      .query(
        `
    query AllRedirects {
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
      let source = normalizeRedirect(from);
      let destination = normalizeRedirect(to);

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

      if (postfix) {
        const source = `/${locale}/${slugs[key]}`;
        const destination = `/${locale}/${key}`;

        if (source !== destination) {
          rewrite.push({
            source,
            destination,
            locale: false
          });
        }
      }

      if (source !== destination) {
        rewrite.push({
          source,
          destination,
          locale: false
        });
      }

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
    poweredByHeader: false,

    async rewrites() {
      const { locales } = i18n;
      const rewrites = locales.reduce((acc, locale) => {
        const slugs = require(`./locales/${locale}/slugs.json`);

        return [...acc, ...createRewrites(slugs, locale)];
      }, []);

      return {
        beforeFiles: rewrites
      };
    },

    async redirects() {
      const dynamicRedirects = await fetchAllRedirects();
      const staticRedirects = getStaticRedirects();

      return [...staticRedirects, ...dynamicRedirects];
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
      minimumCacheTTL: 60 * 60 * 24
    },

    experimental: {
      staticPageGenerationTimeout: 60 * 5
    },

    httpAgentOptions: {
      keepAlive: false
    }
  }
);
