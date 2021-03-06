export default function List({ ordered = false, children }) {
  const Tag = ordered ? 'ol' : 'ul';

  return <Tag className="list-disc list-outside ml-16 md:ml-8">{children}</Tag>;
}
