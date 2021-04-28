import { withNextRouter } from 'storybook-addon-next-router';
import Header from './index';

export default {
  title: 'Header',
  component: Header,
  decorators: [withNextRouter]
};

export const Primary = () => (
  <Header
    metaItems={[
      {
        url: '/',
        label: 'Presse'
      }
    ]}
    items={[
      {
        url: '/',
        label: 'Mach Mit!'
      },

      {
        url: '/',
        label: 'Aktionen'
      },

      {
        url: '/',
        label: 'Material'
      },

      {
        url: '/',
        label: 'Sichere Häfen'
      },

      {
        url: '/',
        label: 'Aktuelles'
      },

      {
        url: '/',
        label: 'Über Uns'
      },

      {
        url: '/',
        label: 'Spenden'
      }
    ]}
  />
);

Primary.storyName = 'Default';
Primary.parameters = {
  nextRouter: {
    locales: ['de', 'en'],
    path: '/profile/[id]',
    asPath: '/profile/lifeiscontent',
    query: {
      id: 'lifeiscontent'
    }
  }
};
