import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { getFullClientUrl } from '@/lib/url';
import Form from '@/components/Form';
import Button from '@/components/Form/Button';
import Checkbox from '@/components/Form/Checkbox';
import TextInput from '@/components/Form/TextInput';
import Row from '@/components/Form/Row';
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

    const toast = (await import('react-hot-toast')).default;

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
            ref={register({
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('newsletter.form.email.required')
              }
            })}
            error={errors?.email}
          />
        </Row>

        <Row primaryGrid={false} size="small">
          <Checkbox
            name="consent"
            ref={register({
              required: t('newsletter.form.email.required')
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
