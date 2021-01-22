import Heading from '@/components/Heading';
import Image from '@/components/Image';

export default function StageMedium({
  kicker,
  title,
  intro,
  image,
  className
}) {
  return (
    <section
      className={`grid grid-layout-primary bg-orange-200 relative ${className}`}
    >
      {image && (
        <Image
          image={image}
          objectFit="cover"
          layout="fill"
          className="col-span-full h-96 md:h-full w-full relative md:static"
        />
      )}

      <div
        className={`col-span-full md:col-start-3 relative bg-orange-200 ${
          image
            ? 'py-8 md:px-12 md:my-40 md:-ml-12 md:col-span-6'
            : 'md:my-20 md:col-span-9'
        }`}
      >
        <Heading level={1} kicker={kicker} className="py-5 px-10 md:px-0">
          {title}
        </Heading>

        {intro && (
          <p className="font-brezel text-base md:text-medium leading-normal px-10 md:px-0">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
