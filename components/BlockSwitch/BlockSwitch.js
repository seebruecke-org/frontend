import clsx from 'clsx';

import contentBlocks from '@/components/Blocks';

import { BLOCK_PREFIX } from '@/lib/constants';

const blockMap = contentBlocks.reduce((acc, block) => {
  const { name, Component } = block;
  acc[`${BLOCK_PREFIX}${name}`] = Component;

  return acc;
}, {});

export default function BlockSwitch({ blocks, className }) {
  if (!blocks) {
    return null;
  }

  return (
    <div className={clsx('grid grid-layout-primary', className)}>
      {blocks.map(({ __typename: type, ...props }, index) => {
        const BlockComponent = blockMap[type] || null;

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
              previous: index > 1 && blocks[index - 1].__typename,
              next: blocks.length > index + 1 && blocks[index + 1].__typename
            }}
            {...props}
          />
        );
      })}
    </div>
  );
}
