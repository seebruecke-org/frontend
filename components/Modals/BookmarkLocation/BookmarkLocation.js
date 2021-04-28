import { useTranslation } from 'next-i18next';

import Form, { TextInput } from '@/components/Form';
import Heading from '@/components/Heading';
import Modal from '@/components/Modal';

export default function BookmarkLocationFormModal({ onClose = () => {} }) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={true} onClose={onClose}>
      <Heading level={2} as={4}>
        {t('modal.bookmark.title')}
      </Heading>

      <Form>
        <div className="col-span-full">
          <TextInput
            placeholder={t('modal.bookmark.placeholder')}
            name="location"
          />
        </div>
      </Form>
    </Modal>
  );
}
