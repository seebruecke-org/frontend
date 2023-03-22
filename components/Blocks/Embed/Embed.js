import Embed from '@/components/Embed';

export default function EmbedBlock({ code }) {
  return (
    <div className="col-span-full md:col-start-3 md:col-span-9 my-10">
      <Embed code={code} />
    </div>
  );
}
