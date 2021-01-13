export default function HStack({ as = 'div', gap = 1, children, className, ...props }) {
  const Tag = as;

  return (
    <Tag className={`flex flex-row space-x-${gap} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
