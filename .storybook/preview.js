import '../lib/styles/tailwind.css';

import { addDecorator } from '@storybook/react';
import { I18nextProvider } from 'react-i18next';
import { urqlDecorator } from '@urql/storybook-addon';
import i18n from './i18n';
import React from 'react';

addDecorator(urqlDecorator);

export const decorators = [
  (Story) => (
    <I18nextProvider i18n={i18n}>
      <Story />
      </I18nextProvider>
  ),
];
