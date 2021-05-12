import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { blockNameMatches } from '@/lib/blocks';
import { BLOCK_PREFIX } from '@/lib/constants';

const blockMap = {
  Accordion: dynamic(() => import('@/components/Blocks/Accordion')),
  Actions: dynamic(() => import('@/components/Blocks/Actions')),
  Contact: dynamic(() => import('@/components/Blocks/Contact')),
  Fundraisingbox: dynamic(() => import('@/components/Blocks/Fundraisingbox')),
  Heading: dynamic(() => import('@/components/Blocks/Heading')),
  Material: dynamic(() => import('@/components/Blocks/Material')),
  Media: dynamic(() => import('@/components/Blocks/Media')),
  Newsletter: dynamic(() => import('@/components/Blocks/Newsletter')),
  Richtext: dynamic(() => import('@/components/Blocks/Richtext')),
  StageMedium: dynamic(() => import('@/components/Blocks/StageMedium')),
  StageLarge: dynamic(() => import('@/components/Blocks/StageLarge')),
  SubNavigation: dynamic(() => import('@/components/Blocks/SubNavigation')),
  TeaserLarge: dynamic(() => import('@/components/Blocks/TeaserLarge')),
  TeasersSmall: dynamic(() => import('@/components/Blocks/TeasersSmall')),
  Unterbrecher: dynamic(() => import('@/components/Blocks/Unterbrecher'))
};

export default function BlockSwitch({
  blocks,
  className,
  scrollMargin = false,
  blockProps = {}
}) {
  if (!blocks) {
    return null;
  }

  return (
    <div className={clsx('grid grid-layout-primary max-w-full', className)}>
      {blocks.map(({ __typename: type, ...props }, index) => {
        const shortBlockName = type.replace(BLOCK_PREFIX, '');
        const BlockComponent = blockMap[shortBlockName] || null;
        const extraBlockProps = Object.entries(blockProps).reduce(
          (acc, [key, value]) => {
            if (blockNameMatches(key, type)) {
              acc = value;
            }

            return acc;
          },
          {}
        );

        if (!BlockComponent) {
          return (
            <code
              key={`block-not-${index}`}
              className="col-start-2 col-span-10"
            >
              The block &quot;{type}&quot; isn&apos;t implemented yet.
            </code>
          );
        }

        return (
          <BlockComponent
            key={`block-${type}-${index}`}
            blockContext={{
              index,
              previous: index > 1 && blocks[index - 1].__typename,
              next: blocks.length > index + 1 && blocks[index + 1].__typename
            }}
            scrollMargin={scrollMargin}
            {...extraBlockProps}
            {...props}
          />
        );
      })}
    </div>
  );
}
