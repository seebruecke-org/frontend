export default function Heading({ attributes: { level, content }}) {
  const levels = {
    h1: 'font-brezel text-2xl md:text-4xl italic',
    h2: 'font-rubik text-large md:text-2xl font-bold',
    h3: 'font-rubik text-medium md:text-xl font-bold',
    h4: 'font-rubik text-base md:text-large font-bold'
  }

  const Tag = `h${level}`;

  return <Tag className={`${levels[`h${level}`]} px-10 md:px-0`}>
    {content}
  </Tag>
}
