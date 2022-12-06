import { useTranslation } from 'next-i18next';

import { query as queryGlobalData } from '@/lib/global';

import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import Richtext from '@/components/Blocks/Richtext';
import SEO from '@/components/SEO';
import TeasersSmall from '@/components/Blocks/TeasersSmall';

export default function Custom404() {
  const { t } = useTranslation('404');

  return (
    <PageBody firstBlock="Heading" lastBlock="Richtext">
      <SEO title={t('title.content')} />

      <div className="grid grid-layout-primary">
        <Heading level={1} kicker={t('title.kicker')}>
          {t('title.content')}
        </Heading>

        <Richtext richtext={t('intro')} />

        <TeasersSmall
          items={[
            {
              title: t('locals.title'),
              link: {
                url: t('locals.url'),
                label: t('locals.label')
              }
            },

            {
              title: t('contact.title'),
              link: {
                url: t('contact.url'),
                label: t('contact.label')
              }
            },

            {
              title: t('donation.title'),
              link: {
                url: t('donation.url'),
                label: t('donation.label')
              }
            }
          ]}
        />
      </div>
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const { initialState = null, ...globalData } = await queryGlobalData(locale, [
    '404'
  ]);

  return {
    revalidate: 20,
    props: {
      ...globalData,
      initialState
    }
  };
}
