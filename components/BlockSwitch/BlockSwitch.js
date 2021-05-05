import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { blockNameMatches } from '@/lib/blocks';
import { BLOCK_PREFIX } from '@/lib/constants';

const blockMap = {
  [`${BLOCK_PREFIX}Accordion`]: dynamic(() =>
    import('@/components/Blocks/Accordion')
  ),
  [`${BLOCK_PREFIX}Actions`]: dynamic(() =>
    import('@/components/Blocks/Actions')
  ),
  [`${BLOCK_PREFIX}Contact`]: dynamic(() =>
    import('@/components/Blocks/Contact')
  ),
  [`${BLOCK_PREFIX}Fundraisingbox`]: dynamic(() =>
    import('@/components/Blocks/Fundraisingbox')
  ),
  [`${BLOCK_PREFIX}Heading`]: dynamic(() =>
    import('@/components/Blocks/Heading')
  ),
  [`${BLOCK_PREFIX}Material`]: dynamic(() =>
    import('@/components/Blocks/Material')
  ),
  [`${BLOCK_PREFIX}Media`]: dynamic(() => import('@/components/Blocks/Media')),
  [`${BLOCK_PREFIX}Newsletter`]: dynamic(() =>
    import('@/components/Blocks/Newsletter')
  ),
  [`${BLOCK_PREFIX}Richtext`]: dynamic(() =>
    import('@/components/Blocks/Richtext')
  ),
  [`${BLOCK_PREFIX}StageMedium`]: dynamic(() =>
    import('@/components/Blocks/StageMedium')
  ),
  [`${BLOCK_PREFIX}StageLarge`]: dynamic(() =>
    import('@/components/Blocks/StageLarge')
  ),
  [`${BLOCK_PREFIX}SubNavigation`]: dynamic(() =>
    import('@/components/Blocks/SubNavigation')
  ),
  [`${BLOCK_PREFIX}TeaserLarge`]: dynamic(() =>
    import('@/components/Blocks/TeaserLarge')
  ),
  [`${BLOCK_PREFIX}TeasersSmall`]: dynamic(() =>
    import('@/components/Blocks/TeasersSmall')
  ),
  [`${BLOCK_PREFIX}Unterbrecher`]: dynamic(() =>
    import('@/components/Blocks/Unterbrecher')
  )
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
    <div className={clsx('grid grid-layout-primary', className)}>
      {blocks.map(({ __typename: type, ...props }, index) => {
        const BlockComponent = blockMap[type] || null;
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
