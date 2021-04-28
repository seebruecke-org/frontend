const path = require('path');

const svgPath = path.resolve(__dirname, '../public/icons');

const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  stories: ['../components/**/*stories.js'],
  addons: ['@storybook/addon-viewport', '@storybook/addon-essentials', 'storybook-css-modules-preset'],
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
        }
      ]
    });

    config.resolve = Object.assign(config.resolve, {
      alias: {
        "@/components": resolve("../components"),
        "@/public": resolve("../public"),
        "@/locales": resolve("../public/locales"),
        "@/styles": resolve("../lib/styles"),
        "@/lib": resolve("../lib"),
        'next-i18next': 'react-i18next'
      }
    });

    return config;
  }
};
