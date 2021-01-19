import Heading from '@/components/Heading';

export default function HeadingBlock({ level, text, kicker }) {
  return (
    <Heading
      level={parseInt(level.substr(1), 10)}
      kicker={kicker}
      className="pt-20 col-span-full md:col-start-3 md:col-span-9"
    >
      {text}
    </Heading>
  );
}
