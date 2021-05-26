import clsx from 'clsx';

export default function List({ ordered = false, children }) {
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag
      className={clsx(
        'list-outside ml-16 md:ml-8',
        ordered && 'list-decimal',
        !ordered && 'list-disc'
      )}
    >
      {children}
    </Tag>
  );
}
