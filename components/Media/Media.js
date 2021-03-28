import NextImage from 'next/image';

import HTML from '@/components/HTML';

export default function Media({
  image: {
    description,
    media: { caption, url, width, height }
  },
  className,
  classNameImage,
  classNameCaption,
  ...props
}) {
  const imageProps = {
    src: `${process.env.NEXT_CMS_DOMAIN}${url}`,
    width: props?.layout === 'fill' ? undefined : width,
    height: props?.layout === 'fill' ? undefined : height,
    ...props
  };

  return (
    <figure className={`leading-none text-none ${className}`}>
      <div className={classNameImage}>
        <NextImage {...imageProps} />
      </div>

      {description ||
        (caption && (
          <figcaption
            className={`font-rubik italic text-2xs px-10 py-5 md:p-5 text-gray-600 font-rubik-features ${classNameCaption}`}
          >
            <HTML html={description || caption} />
          </figcaption>
        ))}
    </figure>
  );
}
