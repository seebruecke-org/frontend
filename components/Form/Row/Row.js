import clsx from 'clsx';

export default function Row({
  children,
  primaryGrid = true,
  direction = 'col',
  className,
  size = 'regular'
}) {
  let padding = 'py-8';

  if (size === 'small') {
    padding = 'py-2';
  }

  return (
    <div
      className={clsx(
        'col-span-full flex px-8 md:px-0',
        primaryGrid && 'md:col-start-3 md:col-span-7',
        direction === 'col' && 'flex-col',
        padding,
        className
      )}
    >
      {children}
    </div>
  );
}
