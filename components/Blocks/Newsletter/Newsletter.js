import Newsletter from '@/components/Newsletter';

export default function NewsletterBlock(props) {
  return (
    <div className="col-span-full md:col-start-3 md:col-span-9 my-10 md:my-20">
      <Newsletter {...props} />
    </div>
  );
}
