import Heading from '@/components/Heading';

import { blockNameMatches } from '@/lib/blocks';

export default function HeadingBlock({
  level,
  text,
  kicker,
  children,
  as,
  blockContext = {}
}) {
  const { previous } = blockContext;
  const normalizedLevel =
    typeof level === 'string' ? parseInt(level.substr(1), 10) : level;
  const normalizedChildren = text || children;
  let marginTop = 'pt-10 md:pt-14';

  if (normalizedLevel === 1) {
    marginTop = 'pt-14 md:pt-24';

    if (blockNameMatches(previous, 'SubNavigation')) {
      marginTop = 'pt-14 md:pt-32';
    }
  } else if (blockNameMatches(previous, 'SubNavigation')) {
    marginTop = 'pt-14 md:pt-24';
  }

  return (
    <Heading
      level={normalizedLevel}
      kicker={kicker}
      className={`${marginTop} px-8 md:px-0 col-span-full md:col-start-3 md:col-span-9`}
      as={as}
    >
      {normalizedChildren}
    </Heading>
  );
}
