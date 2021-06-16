import { useTranslation } from 'next-i18next';

import Form from '@/components/Form';
import TextInput from '@/components/Form/TextInput';
import Heading from '@/components/Heading';
import Modal from '@/components/Modal';

import useBookmarkedLocation from '@/lib/hooks/useBookmarkedLocation';

export default function BookmarkLocationFormModal({ onClose = () => {} }) {
  const { t } = useTranslation();
  const { bookmark } = useBookmarkedLocation();

  return (
    <Modal isOpen={true} onClose={onClose}>
      <Heading level={2} as={4}>
        {t('modal.bookmark.title')}
      </Heading>

      <button
        onClick={() => {
          bookmark({
            name: 'Berlin',
            link: '/mach-mit/deutschland/berlin'
          });
        }}
      >
        bookmark this thing
      </button>

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
