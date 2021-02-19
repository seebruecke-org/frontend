import Link from 'next/link';

import CTA from '@/components/CTA';
import Heading from '@/components/Heading';
import Image from '@/components/Image';

function getBackgroundColor(type) {
  switch (type) {
    case 'action':
      return 'bg-turquoise-300 text-black';

    case 'campaign':
      return 'bg-orange-200 text-black';
  }

  return 'bg-orange-800 text-white';
}

export default function Unterbrecher({
  uTitle: title,
  intro,
  uCta: cta,
  type,
  uMedia: media,
  reversed = false,
  size = 'small'
}) {
  const background = getBackgroundColor(type);

  return (
    <section
      className={`flex flex-col py-16 ${
        reversed && 'flex-col-reverse md:flex-row-reverse'
      } md:flex-row md:items-center col-span-full ${
        size === 'small' && 'md:col-start-3 md:col-span-9'
      } ${size === 'large' && 'md:col-start-2 md:col-span-12'}`}
    >
      <div
        className={`${background} flex flex-col justify-center md:min-h-full w-full md:w-2/4 px-10 md:px-16 py-16`}
      >
        <Heading as={1} kicker={title?.kicker} level={title.level}>
          {title.text}
        </Heading>

        {intro && (
          <p className="font-brezel text-base md:text-medium leading-tight mt-5">
            {intro}
          </p>
        )}

        {cta && (
          <div className="mt-12 md:mt-16">
            <CTA {...cta} />
          </div>
        )}
      </div>

      <Link href={cta.path}>
        <a className="block w-full md:w-2/4 px-6 md:px-0 md:py-10">
          <Image
            image={media}
            classNameImage={`flex ${
              reversed ? 'justify-end' : 'justify-start'
            }`}
          />
        </a>
      </Link>
    </section>
  );
}
