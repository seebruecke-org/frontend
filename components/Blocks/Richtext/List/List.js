export default function List({ ordered = false, children }) {
  const Tag = ordered ? 'ol' : 'ul';

  return <Tag className="list-disc list-outside">{children}</Tag>;
}
