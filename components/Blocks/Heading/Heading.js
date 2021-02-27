import Heading from '@/components/Heading';

export default function HeadingBlock({ level, text, kicker, children, as }) {
  const normalizedLevel =
    typeof level === 'string' ? parseInt(level.substr(1), 10) : level;
  const normalizedChildren = text || children;

  return (
    <Heading
      level={normalizedLevel}
      kicker={kicker}
      className="pt-14 px-8 md:px-0 col-span-full md:col-start-3 md:col-span-9"
      as={as}
    >
      {normalizedChildren}
    </Heading>
  );
}
