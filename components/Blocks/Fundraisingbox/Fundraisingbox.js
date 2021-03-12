import FundraisingBox from '@/components/Fundraisingbox';

export default function FundraisingboxBlock({ script_url }) {
  return (
    <div className="col-span-full md:col-start-3 md:col-span-9 my-10">
      <FundraisingBox scriptUrl={script_url} />
    </div>
  );
}
