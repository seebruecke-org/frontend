import { withNextRouter } from 'storybook-addon-next-router';
import CTA from './CTA';

export default {
  title: 'CTA',
  component: CTA,
  decorators: [withNextRouter]
};

export const Primary = () => (
  <CTA
    link={{
      url: '/',
      label: 'Folge Uns'
    }}
  />
);

Primary.storyName = 'Default';

export const Inverse = () => (
  <CTA
    inverse
    link={{
      url: '/',
      label: 'Folge Uns'
    }}
  />
);

Inverse.storyName = 'Inverse';
