import { withNextRouter } from 'storybook-addon-next-router';
import Breadcrumbs from './Breadcrumbs';

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
  decorators: [withNextRouter]
};

export const Primary = () => (
  <Breadcrumbs
    crumbs={[
      {
        url: '/',
        label: 'Folge Uns'
      },

      {
        url: '/',
        label: 'Folge Uns'
      },

      {
        url: '/',
        label: 'Folge Uns'
      }
    ]}
  />
);

Primary.storyName = 'Default';
