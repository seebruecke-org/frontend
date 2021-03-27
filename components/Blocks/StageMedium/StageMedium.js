import { StageMedium } from '@/components/Stages';

export default function StageMediumBlock({ image, ...props }) {
  return (
    <StageMedium image={image?.media} className="col-span-full" {...props} />
  );
}
