import React from 'react';

import { query as queryGlobalData } from '../../lib/global';

import Form, {
  Button,
  Checkbox,
  Fieldset,
  Row,
  TextInput,
  Textarea,
  Radio
} from '@/components/Form';
import Heading from '@/components/Heading';

export default function FormPage() {
  return (
    <article className="grid grid-layout-primary pt-20">
      <Heading
        level={1}
        kicker="Deine Aktion"
        className="col-span-full md:col-start-3 md:col-span-9 px-10 md:px-0"
      >
        Aktions&shy;formular
      </Heading>

      <Form>
        <Row>
          <TextInput name="sender" label="Deine Name" />
        </Row>

        <Row>
          <Textarea name="remarks" label="Deine Nachricht an uns" rows={10} />
        </Row>

        <Row>
          <Checkbox name="remarks">
            Ich akzeptiere die Datenschutzerklärung.
          </Checkbox>
        </Row>

        <Row>
          <Button>Eintragen</Button>
        </Row>
      </Form>
    </article>
  );
}

export async function getStaticProps({ locale }) {
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

  return {
    revalidate: 60,
    props: {
      ...globalData,
      initialState
    }
  };
}
