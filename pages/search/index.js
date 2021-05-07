import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { search } from '@/lib/search';
import { query as queryGlobalData } from '@/lib/global';
import Form, { Button, TextInput, Row } from '@/components/Form';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SearchEntry from '@/components/Teaser/SearchEntry';
import SEO from '@/components/SEO';

export default function SearchPage({ results }) {
  const { query } = useRouter();
  const { t } = useTranslation();

  return (
    <PageBody className="grid grid-layout-primary">
      <SEO
        title={`${t('search.title')} ${query?.query && '—'} ${query?.query}`}
      />

      <Form method="get" highlight className="pb-20">
        <Row>
          <Heading level={1}>{t('search.title')}</Heading>
        </Row>
        <Row direction="row">
          <div className="w-5/6">
            <TextInput name="query" value={query?.query ?? ''} />
          </div>

          <div className="w-2/12 pl-10">
            <Button>{t('search.submit')}</Button>
          </div>
        </Row>
      </Form>

      <ul className="col-span-full pb-20 md:pb-40">
        {results.map((result, index) => (
          <li key={`result-${result.objectID}`}>
            <SearchEntry {...result} isLast={index + 1 === results.length} />
          </li>
        ))}
      </ul>
    </PageBody>
  );
}

export async function getServerSideProps({ locale, query }) {
  const { initialState = null, ...globalData } = await queryGlobalData(locale);
  const results = await search(query?.query);

  return {
    props: {
      ...globalData,
      initialState,
      results
    }
  };
}
