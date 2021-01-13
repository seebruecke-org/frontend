import Heading from '@/components/Heading';
import Image from '@/components/Image';

export default function StageMedium({ kicker, title, image }) {
  return <div className="flex flex-col items-center bg-orange-200 relative">
    {image && (
      <div className="max-w-wide absolute w-full h-full">
        <Image image={image} objectFit="cover" layout="fill" />
      </div>
    )}

    <div className={`grid grid-cols-12 max-w-wide w-full ${image && 'py-56'}`}>
    <div className={`col-start-2 col-span-5 w-full relative bg-orange-200 self-start ${image ? 'px-10 py-12' : 'my-20'}`}>
      <Heading level={1} kicker={kicker} className="py-5">
        {title}
      </Heading>
    </div>
    </div>
  </div>
}
