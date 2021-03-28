import NextImage from 'next/image';

import Richtext from '@/components/Blocks/Richtext';

export default function Media({
  image = {
    media: null
  },
  className,
  classNameImage,
  classNameCaption,
  ...props
}) {
  if (!image.media) {
    return null;
  }

  const {
    caption,
    media: { caption: imageCaption, url, width, height }
  } = image;
  const imageProps = {
    src: `${process.env.NEXT_CMS_DOMAIN}${url}`,
    width: props?.layout === 'fill' ? undefined : width,
    height: props?.layout === 'fill' ? undefined : height,
    ...props
  };

  return (
    <figure className={`leading-none text-none ${className}`}>
      <div className={classNameImage}>{<NextImage {...imageProps} />}</div>

      {(caption || imageCaption) && (
        <figcaption
          className={`font-rubik italic text-2xs px-10 py-5 md:p-5 text-gray-600 font-rubik-features ${classNameCaption}`}
        >
          <Richtext richtext={caption || imageCaption} isSmall />
        </figcaption>
      )}
    </figure>
  );
}
