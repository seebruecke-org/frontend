import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { blockNameMatches } from '@/lib/blocks';
import { BLOCK_PREFIX } from '@/lib/constants';

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
        const BlockComponent = dynamic(() =>
          import(
            `@/components/Blocks/${type.replace('ComponentSharedBlocks', '')}`
          )
        );
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
