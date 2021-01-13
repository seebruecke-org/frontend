import NextImage from 'next/image';

import HTML from '@/components/HTML';

export default function Image({
  image: {
    caption,
    description,
    sourceUrl,
    details: { width, height }
  },
  className,
  ...props
}) {
  const imageProps = {
    src: sourceUrl,
    width: props?.layout === 'fill' ? undefined : width,
    height: props?.layout === 'fill' ? undefined : height,
    ...props
  };

  return (
    <figure className={`leading-none text-none ${className}`}>
      <NextImage {...imageProps} />

      {(caption || description) && (
        <figcaption className="font-rubik italic text-2xs p-5 text-gray-600">
          <HTML html={description} />
          <HTML html={caption} />
        </figcaption>
      )}
    </figure>
  );
}
