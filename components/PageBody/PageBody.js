const blocksWithOuterMargin = [
  'ComponentSharedBlocksHeading',
  'ComponentSharedBlocksRichtext',
  'ComponentSharedBlocksAccordion'
];

export default function PageBody({
  children,
  firstBlock = null,
  lastBlock = null,
  className
}) {
  const addMarginBottom =
    lastBlock && blocksWithOuterMargin.includes(lastBlock);
  const addMarginTop = firstBlock && blocksWithOuterMargin.includes(firstBlock);

  return (
    <article
      className={`${addMarginTop && 'mt-10 md:mt-20'} ${
        addMarginBottom && 'pb-20 md:pb-60'
      } ${className}`}
    >
      {children}
    </article>
  );
}
