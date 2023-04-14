const path = require('path');

const svgPath = path.resolve(__dirname, '../public/icons');

module.exports = {
  stories: ['../components/**/*stories.js'],
  addons: ['@storybook/addon-viewport'],
  webpackFinal: (config) => {
    const rules = config.module.rules;

    // modify storybook's file-loader rule to avoid conflicts with svgr
    const fileLoaderRule = rules.find((rule) => rule.test.test('.svg'));
    fileLoaderRule.exclude = svgPath;

    rules.push({
      test: /\.svg$/,
      include: svgPath,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true
          }
        }
      ]
    });

    return config;
  }
};
