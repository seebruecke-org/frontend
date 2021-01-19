import { StageMedium } from '@/components/Stages';

export default function StageMediumBlock({ image, ...props }) {
  const stageImage = image?.image;

  return (
    <StageMedium image={stageImage} className="col-span-full" {...props} />
  );
}
