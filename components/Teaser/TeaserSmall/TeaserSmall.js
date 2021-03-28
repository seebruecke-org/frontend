import StrapiLink from '@/components/StrapiLink';

export default function TeaserSmall({ title, link, type = 'internal' }) {
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
      className={`relative px-8 py-10 md:p-10 h-full flex flex-col ${background} hover:bg-black hover:text-white`}
    >
      <h2>
        <StrapiLink
          link={link}
          className="block font-brezel text-xl italic font-bold leading-none mb-10"
        >
          {title}
        </StrapiLink>
      </h2>

      <StrapiLink
        link={link}
        className="absolute top-0 left-0 w-full h-full opacity-0"
        aria-hidden="true"
      >
        {title}
      </StrapiLink>
    </div>
  );
}
