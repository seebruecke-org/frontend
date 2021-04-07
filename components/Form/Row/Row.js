import clsx from 'clsx';

export default function Row({
  children,
  primaryGrid = true,
  direction = 'col',
  className
}) {
  return (
    <div
      className={clsx(
        'col-span-full flex py-8 px-8 md:px-0',
        primaryGrid && 'md:col-start-3 md:col-span-7',
        direction === 'col' && 'flex-col',
        className
      )}
    >
      {children}
    </div>
  );
}
