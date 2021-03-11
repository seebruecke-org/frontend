export default function Row({
  children,
  primaryGrid = true,
  direction = 'col',
  className
}) {
  return (
    <div
      className={`col-span-full ${
        primaryGrid && 'md:col-start-3 md:col-span-7'
      } flex ${
        direction === 'col' && 'flex-col'
      } py-8 px-8 md:px-0 ${className}`}
    >
      {children}
    </div>
  );
}
