import { normalizeBlockName } from '@/lib/blocks';

const BLOCKS_WITH_OUTER_MARGIN = ['Heading', 'Richtext', 'Accordion'].map(
  normalizeBlockName
);

function blocksWithOuterMarginContain(blockName) {
  if (!blockName) {
    return false;
  }

  return BLOCKS_WITH_OUTER_MARGIN.includes(normalizeBlockName(blockName));
}

export default function PageBody({
  children,
  firstBlock = null,
  lastBlock = null,
  className
}) {
  const marginBottom = blocksWithOuterMarginContain(lastBlock);
  const marginTop = blocksWithOuterMarginContain(firstBlock);

  return (
    <article
      className={`${marginTop && 'mt-10 md:mt-20'} ${
        marginBottom && 'pb-20 md:pb-60'
      } ${className}`}
    >
      {children}
    </article>
  );
}
