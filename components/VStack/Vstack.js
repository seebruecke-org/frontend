export default function VStack({
  as = 'div',
  gap = 1,
  children,
  className,
  ...props
}) {
  const Tag = as;

  return (
    <Tag className={`flex flex-col space-y-${gap} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
