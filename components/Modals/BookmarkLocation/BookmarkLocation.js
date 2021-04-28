import Form, { TextInput } from '@/components/Form';
import Heading from '@/components/Heading';
import Modal from '@/components/Modal';

export default function BookmarkLocationFormModal({ onClose = () => {}}) {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <Heading level={2} as={4}>
        Save a location
      </Heading>

      <Form>
        <div className="col-span-full">
          <TextInput placeholder="Search for a location" name="location" />
        </div>
      </Form>
    </Modal>
  );
}
