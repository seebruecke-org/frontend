import { onlyText } from 'react-children-utilities';
import clsx from 'clsx';
import slugify from 'slugify';

export default function Heading({
  children,
  level,
  as,
  kicker = null,
  className,
  ...props
}) {
  const levels = {
    h1: 'font-brezel leading-none text-2xl md:text-4xl font-bold italic break-words sm:break-normal tracking-tight',
    h2: 'font-rubik leading-tight text-large md:text-2xl font-bold break-words sm:break-normal tracking-tight',
    h3: 'font-rubik leading-tight text-medium md:text-xl font-bold break-words sm:break-normal',
    h4: 'font-rubik leading-tight text-base md:text-large font-bold'
  };

  const kickers = {
    h1: 'font-brezel italic text-base md:text-medium block mb-2',
    h2: 'font-rubik text-xs uppercase',
    h3: 'font-rubik text-xs uppercase',
    h4: 'font-rubik text-xs uppercase'
  };

  const Tag = `h${`${level}`.replace('h', '')}`;
  const text = onlyText(children);
  const id = slugify(text, {
    strict: true,
    lower: true
  });

  return (
    <Tag
      className={clsx(
        'font-rubik-features max-w-full',
        levels[`h${as ?? level}`],
        className
      )}
      {...props}
      id={id}
    >
      {kicker && (
        <small
          className={clsx(
            kickers[`h${as ?? level}`],
            'block font-normal leading-none tracking-normal'
          )}
        >
          <span dangerouslySetInnerHTML={{ __html: kicker }} />
          <span className="sr-only">:</span>
        </small>
      )}

      <span dangerouslySetInnerHTML={{ __html: text }} />
    </Tag>
  );
}
