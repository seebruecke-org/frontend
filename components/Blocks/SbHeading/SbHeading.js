import Heading from '@/components/Heading';

export default function SbHeadingBlock({ attributes: { level, content, kicker }}) {
  return <Heading level={level} kicker={kicker} className="pt-20 col-start-2 col-span-9">
    {content}
  </Heading>
}
