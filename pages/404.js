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
              title: 'Alle Lokalgruppen',
              link: {
                url: '/mach-mit/lokalgruppen',
                label: 'Zur Übersicht'
              }
            },

            {
              title: 'Kontakt',
              link: {
                url: '/kontakt',
                label: 'Zur Seite'
              }
            },

            {
              title: 'Spenden',
              link: {
                url: '/spenden',
                label: 'Zur Seite'
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
