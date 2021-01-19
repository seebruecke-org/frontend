import { StageLarge } from '@/components/Stages';

export default function StageLargeBlock({ image, ...props }) {
  const stageImage = image?.image;

  return <StageLarge image={stageImage} className="col-span-full" {...props} />;
}
