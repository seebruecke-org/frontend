import { useTranslation } from 'next-i18next';

import Form from '@/components/Form';
import Button from '@/components/Form/Button';
import Heading from '@/components/Heading';
import Modal from '@/components/Modal';
import TextInput from '@/components/Form/TextInput';

export default function SearchFormModal({ onClose = () => {} }) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={true} onClose={onClose}>
      <Heading level={2} as={4}>
        {t('modal.search.title')}
      </Heading>

      <Form method="get" action={`/${t('slugs.search')}`}>
        <div className="col-span-full">
          <TextInput placeholder={t('modal.search.placeholder')} name="query" />
        </div>

        <div className="col-span-full pt-6">
          <Button type="submit">{t('modal.search.submit')}</Button>
        </div>
      </Form>
    </Modal>
  );
}
