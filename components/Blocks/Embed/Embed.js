import Embed from '@/components/Embed';

export default function EmbedBlock({ embed_data }) {
  return (
    <div className="col-span-full md:col-start-3 md:col-span-9 my-10">
      <Embed embed_data={embed_data} />
    </div>
  );
}
