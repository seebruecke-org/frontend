import Image from '@/components/Image';
import SectionNavigation from '@/components/SectionNavigation';

export default function StageMedium({ kicker, title, siblings, image }) {
  return <div className="flex flex-col items-center bg-orange-200">
    <div className="max-w-regular w-full px-10 md:px-0 grid grid-cols-2">
      <h1 className="font-brezel italic py-20">
        <small className="text-medium block leading-none">
          {kicker}
        </small>

        <span className="font-bold text-4xl leading-none">{title}</span>
      </h1>

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
