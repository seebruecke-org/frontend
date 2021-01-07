import { Paragraph } from '@/components/Blocks';
import VStack from '@/components/VStack';

const blockMap = {
  'CoreParagraphBlock': Paragraph
};

export default function BlockSwitch({ blocks }) {
  return <div className="flex justify-center">
    <VStack gap={10} className="grid max-w-regular w-full">
    {blocks.map(({ __typename: type, ...props }) => {
      const BlockComponent = blockMap[type] || null;

      if (!BlockComponent) {
        return <code>
          The block "{type}" isn't implemented yet.
        </code>;
      }

      return <BlockComponent {...props} />
    })}
  </VStack>
  </div>
}
