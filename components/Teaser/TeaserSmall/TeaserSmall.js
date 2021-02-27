import NextLink from 'next/link';

export default function TeaserSmall({ title, path, label, type = 'internal' }) {
  const href = path;
  let background = '';

  switch (type) {
    case 'campaign':
      background = 'bg-orange-200 text-black';
      break;

    case 'action':
      background = 'bg-turquoise-300 text-black';
      break;

    default:
      background = 'bg-orange-800 text-white';
  }

  return (
    <div
      className={`relative p-10 h-full flex flex-col ${background} hover:bg-black hover:text-white`}
    >
      <h2>
        <NextLink href={href}>
          <a className="block font-brezel text-xl italic font-bold leading-none mb-10">
            {title}
          </a>
        </NextLink>
      </h2>

      <span className="block font-rubik text-small underline justify-end mt-auto">
        {label}
      </span>

      <NextLink href={href}>
        <a
          href={href}
          className="absolute top-0 left-0 w-full h-full opacity-0"
          aria-hidden="true"
        >
          {title}
        </a>
      </NextLink>
    </div>
  );
}
