import { useForm } from 'react-hook-form';
import React from 'react';

import { query as queryGlobalData } from '../../lib/global';

import Form, {
  Button,
  Checkbox,
  Row,
  TextInput,
  Textarea
} from '@/components/Form';
import Heading from '@/components/Heading';

export default function FormPage() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <article className="grid grid-layout-primary pt-20">
      <Heading
        level={1}
        kicker="Deine Aktion"
        className="col-span-full md:col-start-3 md:col-span-9 px-10 md:px-0"
      >
        Aktions&shy;formular
      </Heading>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <TextInput
            name="sender"
            label="Deine Name"
            ref={register({ required: 'Bitte gib einen Namen an' })}
            error={errors?.sender}
          />
        </Row>

        <Row>
          <Textarea
            name="remarks"
            label="Deine Nachricht an uns"
            rows={10}
            ref={register({ required: 'Bitte gib eine Nachricht ein' })}
            error={errors?.remarks}
          />
        </Row>

        <Row>
          <Checkbox
            name="privacy"
            ref={register({
              required: 'Du musst die Datenschutzerklärung akzeptieren.'
            })}
            error={errors?.privacy}
          >
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
