export default function Heading({
  children,
  level,
  as,
  kicker = null,
  className,
  ...props
}) {
  const levels = {
    h1: 'font-brezel leading-none text-2xl md:text-4xl font-bold italic',
    h2: 'font-rubik leading-tight text-large md:text-2xl font-bold',
    h3: 'font-rubik leading-tight text-medium md:text-xl font-bold',
    h4: 'font-rubik leading-tight text-base md:text-large font-bold'
  };

  const kickers = {
    h1: 'font-brezel italic text-base md:text-medium block mb-2',
    h2: 'font-rubik text-xs uppercase',
    h3: 'font-rubik text-xs uppercase',
    h4: 'font-rubik text-xs uppercase'
  };

  const Tag = `h${level.replace('h', '')}`;

  return (
    <Tag
      className={`font-rubik-features ${
        levels[`h${as ?? level}`]
      } ${className}`}
      {...props}
    >
      {kicker && (
        <small
          className={`${
            kickers[`h${as ?? level}`]
          } block font-normal leading-none`}
        >
          {kicker}
          <span className="sr-only">:</span>
        </small>
      )}

      {children}
    </Tag>
  );
}
