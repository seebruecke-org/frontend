module.exports = {
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
