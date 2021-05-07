import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { query as queryGlobalData } from '@/lib/global';
import Form, { Button, TextInput, Row } from '@/components/Form';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SearchEntry from '@/components/Teaser/SearchEntry';

export default function SearchPage({ results }) {
  const { query } = useRouter();
  const { t } = useTranslation();

  console.log(results);

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

      <ul className="col-span-full pb-20 md:pb-40">
        {results.map((result, index) => (
          <li key={`result-${result.id}`}>
            <SearchEntry {...result} isLast={index + 1 === results.length} />
          </li>
        ))}
      </ul>
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

  return {
    props: {
      ...globalData,
      initialState,
      results: [
        {
          id: 1,
          title: 'Sichere Häfen',
          excerpt:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
        },

        {
          id: 2,
          title: 'Erfolge',
          excerpt:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren'
        },

        {
          id: 3,
          title: 'Sicherer Hafen: Hildesheim',
          excerpt:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren'
        },

        {
          id: 4,
          title: 'Aktion: Gegen das Sterben!',
          excerpt:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren'
        },

        {
          id: 4,
          title: 'Kampagne: Die Balkanbruecke',
          excerpt:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren'
        }
      ]
    }
  };
}
