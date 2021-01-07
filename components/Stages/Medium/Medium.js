import SectionNavigation from '@/components/SectionNavigation';
import VStack from '@/components/VStack';

export default function StageMedium({ kicker, title, siblings }) {
  return <div className="flex flex-col items-center bg-orange-200">
    <div className="max-w-regular w-full py-10 px-10 md:px-0">
      <h1 className="font-brezel italic">
        <small className=" text-medium block leading-none">
          {kicker}
        </small>

        <span className="font-bold text-4xl leading-none">{title}</span>
      </h1>
    </div>

    {siblings && (
      <div class="mt-20 w-full">
        <SectionNavigation items={siblings} />
      </div>
      )}
  </div>
}
