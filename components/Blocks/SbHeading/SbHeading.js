import Heading from '@/components/Heading';

export default function SbHeadingBlock({ attributes: { level, content, kicker }}) {
  return <Heading level={level} kicker={kicker} className="pt-20">
    {content}
  </Heading>
}
