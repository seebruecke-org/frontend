import clsx from 'clsx';

import { blockNameMatches } from '@/lib/blocks';
import Richtext from '@/components/Richtext';

export default function RichtextBlock({
  blockContext = {},
  richtext: content,
  ...props
}) {
  const { previous } = blockContext;
  let marginTop = 'mt-5 md:mt-10';

  if (blockNameMatches(previous, 'SubNavigation')) {
    marginTop = 'mt-12 md:mt-20';
  }

  return (
    <Richtext
      className={clsx(
        'col-span-full md:col-start-3 md:col-span-9 space-y-10 mb-5 md:mb-10',
        marginTop
      )}
      content={content}
      {...props}
    />
  );
}
