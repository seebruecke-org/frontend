import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { query as queryGlobalData } from '@/lib/global';

import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import Richtext from '@/components/Blocks/Richtext';
import SEO from '@/components/SEO';
import TeasersSmall from '@/components/Blocks/TeasersSmall';

export default function Custom404() {
  const { asPath } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`/api/notify?subject=404&body=${encodeURIComponent(asPath)}`);
  }, []);

  return (
    <PageBody firstBlock="Heading" lastBlock="Richtext">
      <SEO title={t('404.title.content')} />

      <div className="grid grid-layout-primary">
        <Heading level={1} kicker={t('404.title.kicker')}>
          {t('404.title.content')}
        </Heading>

        <Richtext richtext={t('404.intro')} />

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
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

  return {
    revalidate: 20,
    props: {
      ...globalData,
      initialState
    }
  };
}
