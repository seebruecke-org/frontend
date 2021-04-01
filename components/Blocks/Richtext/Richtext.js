import { blockNameMatches } from '@/lib/blocks';
import Richtext from '@/components/Richtext';

export default function RichtextBlock({ blockContext = {}, richtext }) {
  const { previous } = blockContext;
  let marginTop = 'mt-5 md:mt-10';

  if (blockNameMatches(previous, 'SubNavigation')) {
    marginTop = 'mt-12 md:mt-20';
  }

  return (
    <Richtext
      className={`col-span-full md:col-start-3 md:col-span-9 flex flex-col space-y-10 ${marginTop} mb-5 md:mb-10`}
      content={richtext}
    />
  );
}
