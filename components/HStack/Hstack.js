export default function HStack({ as = 'div', gap = 1, children, ...props }) {
  const Tag = as;

  return <Tag className={`flex flex-row space-x-${gap}`} {...props}>
    {children}
  </Tag>
}
