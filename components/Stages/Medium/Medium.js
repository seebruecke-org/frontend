import Heading from '@/components/Heading';
import Image from '@/components/Image';
import SectionNavigation from '@/components/SectionNavigation';

export default function StageMedium({ kicker, title, siblings, image }) {
  return <div className="flex flex-col items-center bg-orange-200">
    <div className="max-w-regular w-full px-10 md:px-0 grid grid-cols-2">
      <Heading level={1} kicker={kicker} className="py-20">
        {title}
      </Heading>

      {image && (
        <Image image={image} />
      )}
    </div>

    {siblings && siblings.length > 1 && (
      <div className="w-full">
        <SectionNavigation items={siblings} />
      </div>
      )}
  </div>
}
