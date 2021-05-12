import { useForm } from 'react-hook-form';
import React from 'react';

import { query as queryGlobalData } from '../../lib/global';

import Button from '@/components/Form/Button';
import Checkbox from '@/components/Form/Checkbox';
import Form from '@/components/Form';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import Row from '@/components/Form/Row';
import Textarea from '@/components/Form/Textarea';
import TextInput from '@/components/Form/TextInput';

export default function FormPage() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <PageBody firstBlock="Heading" className="grid grid-layout-primary">
      <Heading level={1} kicker="Deine Aktion">
        Aktions&shy;formular
      </Heading>

      <Form onSubmit={handleSubmit(onSubmit)} className="mb-32" padded>
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
