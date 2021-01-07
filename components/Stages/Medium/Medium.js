import SectionNavigation from '@/components/SectionNavigation';
import VStack from '@/components/VStack';

export default function StageMedium({ kicker, title, siblings }) {
  return <div className="flex justify-center bg-orange-200">
    <VStack gap={40} className="max-w-regular w-full py-10 px-10 md:px-0">
      <h1 className="font-brezel italic">
        <small className=" text-medium block leading-none">
          {kicker}
        </small>

        <span className="font-bold text-4xl leading-none">{title}</span>
      </h1>

      {siblings && (
        <SectionNavigation items={siblings} />
      )}
    </VStack>
  </div>
}
