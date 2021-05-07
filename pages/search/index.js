import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { query as queryGlobalData } from '@/lib/global';
import Form, { Button, TextInput, Row } from '@/components/Form';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';

export default function SearchPage() {
  const { query } = useRouter();
  const { t } = useTranslation();

  return (
    <PageBody className="grid grid-layout-primary">
      <Form method="get" highlight className="pb-20">
        <Row>
          <Heading level={1}>{t('search.title')}</Heading>
        </Row>
        <Row direction="row">
          <div className="w-5/6">
            <TextInput name="query" defaultValue={query?.query ?? ''} />
          </div>

          <div className="w-2/12 pl-10">
            <Button>{t('search.submit')}</Button>
          </div>
        </Row>
      </Form>
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

  return {
    props: {
      ...globalData,
      initialState
    }
  };
}
