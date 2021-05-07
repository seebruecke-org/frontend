import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';
import { getFullClientUrl } from '@/lib/url';
import Form, { Checkbox, TextInput, Row, Button } from '@/components/Form';
import Richtext from '@/components/Blocks/Richtext';

export default function Newsletter({ title, intro }) {
  const { register, handleSubmit, errors, reset } = useForm();
  const { t } = useTranslation();
  const onSubmit = async function (data) {
    const result = await fetch(getFullClientUrl('/api/newsletter/subscribe'), {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (result.ok) {
      toast.success(t('newsletter.form.success'));
      reset();
    } else {
      toast.error(t('newsletter.form.error'));
    }
  };

  return (
    <section className="bg-orange-200 md:px-20 pt-10 md:pt-20 pb-12">
      <h2 className="font-brezel text-xl md:text-2xl font-bold italic md:-mb-8 leading-none px-8 md:px-0">
        {title}
      </h2>

      {intro && <Richtext content={intro} />}

      <Form
        primaryGrid={false}
        className="p-0"
        method="post"
        action="/api/newsletter/subscribe"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Row primaryGrid={false} size="small">
          <TextInput
            label={t('newsletter.form.email.label')}
            className="w-full md:w-3/4"
            name="email"
            ref={register({ required: t('newsletter.form.email.required') })}
            error={errors?.email}
          />
        </Row>

        <Row primaryGrid={false} size="small">
          <Checkbox
            name="consent"
            ref={register({
              required: t('newsletter.form.consent.required')
            })}
            error={errors?.consent}
          >
            {t('newsletter.form.consent.label')}
          </Checkbox>
        </Row>

        <Row primaryGrid={false} size="small">
          <Button>{t('newsletter.form.submit.label')}</Button>
        </Row>
      </Form>
    </section>
  );
}
