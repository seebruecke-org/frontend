import { useTranslation } from 'next-i18next';

import Form, { Button, TextInput } from '@/components/Form';
import Heading from '@/components/Heading';
import Modal from '@/components/Modal';

export default function SearchFormModal({ onClose = () => {} }) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={true} onClose={onClose}>
      <Heading level={2} as={4}>
        {t('modal.search.title')}
      </Heading>

      <Form>
        <div className="col-span-full">
          <TextInput
            placeholder={t('modal.search.placeholder')}
            name="search"
          />
        </div>

        <div className="col-span-full pt-6">
          <Button type="submit">{t('modal.search.submit')}</Button>
        </div>
      </Form>
    </Modal>
  );
}
