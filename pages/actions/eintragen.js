import { useForm } from 'react-hook-form';
import React from 'react';

import { query as queryGlobalData } from '../../lib/global';

import Form from '@/components/Form';
import Button from '@/components/Form/Button';
import Checkbox from '@/components/Form/Checkbox';
import Fieldset from '@/components/Form/Fieldset';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import Radio from '@/components/Form/Radio';
import Row from '@/components/Form/Row';
import Textarea from '@/components/Form/Textarea';
import TextInput from '@/components/Form/TextInput';

export default function FormPage() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => console.log(data);

  console.log(errors);

  return (
    <PageBody className="grid grid-layout-primary" firstBlock="Heading">
      <Heading level={1} kicker="Deine Aktion">
        Aktions&shy;formular
      </Heading>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        highlight
        padded
        className="mt-10"
      >
        <Row>
          <TextInput
            name="city"
            label="In welchem Ort findet die Demo oder Aktion statt?"
            ref={register({ required: 'Bitte gibt einen Ort ein' })}
            error={errors?.city}
          />
        </Row>

        <Row>
          <TextInput name="plan" label="Was planst du genau?" />
        </Row>

        <Row>
          <TextInput
            name="contact"
            label="Ansprechpartner*in"
            ref={register}
            help="Bei Großveranstaltungen: Wen können wir als  Presseansprech- partner*in nennen, wenn uns Presse dazu kontaktiert? (opt.)"
            placeholder="Name, Adresse, ..."
          />
        </Row>

        <Fieldset legend="Was trifft auf dich zu?">
          <Radio name="match[]" checked>
            Wir sind eine SEEBRÜCKE-Lokalgruppe
          </Radio>
          <Radio name="match[]">
            Wir sind neu dabei, möchten eventuell eine Lokalgruppe gründen.
            Bitte kontaktiert uns.
          </Radio>
          <Radio name="match[]">Wir sind keine SEEBRÜCKE-Lokalgruppe.</Radio>
        </Fieldset>

        <Row>
          <Textarea
            name="remarks"
            label="Sonst noch etwas von deiner Seite?"
            rows={6}
            ref={register({
              required: 'Hast du gar nichts zu sagen?'
            })}
            error={errors?.remarks}
          />
        </Row>

        <Row>
          <Checkbox
            name="privacy"
            ref={register({
              required: 'Bitte akzeptiere die Datenschutzerklärung.'
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
