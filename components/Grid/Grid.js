export default function Grid({ as = 'div', children, className, ...props }) {
  const Tag = as;

  return <Tag className={`grid gap-10 grid-cols-12 ${className}`} {...props}>
    {children}
  </Tag>
}
