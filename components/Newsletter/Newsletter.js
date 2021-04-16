import Form, { Checkbox, TextInput, Row, Button } from '@/components/Form';
import Richtext from '@/components/Blocks/Richtext';

export default function Newsletter({ title, intro }) {
  return (
    <section className="bg-orange-200 md:px-20 pt-10 md:pt-20 pb-12">
      <h2 className="font-brezel text-xl md:text-2xl font-bold italic md:-mb-8 leading-none px-8 md:px-0">
        {title}
      </h2>

      {intro && <Richtext content={intro} />}

      <Form primaryGrid={false} className="p-0">
        <Row primaryGrid={false}>
          <div className="w-full flex flex-col md:flex-row items-end space-y-8 md:space-x-8 mb-8 md:mb-0">
            <TextInput label="Deine E-Mail" className="w-full md:w-3/4" />
            <Button className="md:self-end">Anmelden</Button>
          </div>

          <Checkbox>Ja, ich möchte per Email informiert werden</Checkbox>
        </Row>
      </Form>
    </section>
  );
}
