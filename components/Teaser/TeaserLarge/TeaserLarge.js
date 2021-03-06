import CTA from '@/components/CTA';

export default function TeaserLarge({ title, intro, cta, type = 'internal' }) {
  let background = '';
  let ctaInverse = true;

  switch (type) {
    case 'campaign':
      background = 'bg-orange-200';
      break;

    case 'action':
      background = 'bg-turquoise-300';
      break;

    case 'general':
      background = 'bg-white';
      break;

    default:
      background = 'bg-orange-800 text-white';
      ctaInverse = false;
  }

  return (
    <section
      className={`py-12 ${
        type === 'general' ? 'md:py-0' : 'md:py-16'
      } col-span-full md:col-start-3 md:col-span-9`}
    >
      <div
        className={`${background} pl-8 md:pl-0 py-16 md:py-24 pr-24 relative`}
      >
        <h2 className="font-brezel text-xl md:text-2xl font-bold italic leading-tight">
          {title}
        </h2>

        <p
          className={`font-rubik text-small md:text-medium mt-4 ${
            type !== 'general' ? 'leading-tight' : 'leading-normal'
          }`}
        >
          {intro}
        </p>

        <div className="mt-8 md:mt-16">
          <CTA {...cta} inverse={ctaInverse} />
        </div>

        <span
          className={`absolute right-full h-full top-0 w-40 hidden md:block ${background}`}
        />
      </div>
    </section>
  );
}
