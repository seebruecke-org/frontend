module.exports = {
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'de'
  },

  async rewrites() {
    return [
      {
        source: '/de/mach-mit/',
        destination: '/de/take-part/',
        locale: false,
      },

      {
        source: '/de/mach-mit/:path*',
        destination: '/de/take-part/:path*',
        locale: false,
      },
    ]
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    return config;
  },

  images: {
    domains: [process.env.NEXT_IMAGE_HOSTNAME]
  },

  env: {
    WP_GRAPHQL_API: process.env.NEXT_WP_GRAPHQL_API
  }
};
