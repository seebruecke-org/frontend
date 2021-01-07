export default function VStack({ as = 'div', gap = 1, children, ...props }) {
  const Tag = as;

  return <Tag className={`flex flex-col space-y-${gap}`} {...props}>
    {children}
  </Tag>
}
