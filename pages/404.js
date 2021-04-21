import { useTranslation } from 'next-i18next';

import { query as queryGlobalData } from '@/lib/global';

import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import Richtext from '@/components/Blocks/Richtext';
import SEO from '@/components/SEO';

export default function Custom404() {
  const { t } = useTranslation();

  return (
    <PageBody firstBlock="Heading" lastBlock="Richtext">
      <SEO title={t('404.title.content')} />

      <div className="grid grid-layout-primary">
        <Heading level={1} kicker={t('404.title.kicker')}>
          {t('404.title.content')}
        </Heading>

        <Richtext richtext={t('404.intro')} />
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
