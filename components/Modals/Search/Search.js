import Form, { Button, TextInput } from '@/components/Form';
import Heading from '@/components/Heading';
import Modal from '@/components/Modal';

export default function SearchFormModal({ onClose = () => {} }) {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <Heading level={2} as={4}>
        Search
      </Heading>

      <Form>
        <div className="col-span-full">
          <TextInput placeholder="Search" name="search" />
        </div>

        <div className="col-span-full pt-6">
          <Button type="submit">Suchen</Button>
        </div>
      </Form>
    </Modal>
  );
}
