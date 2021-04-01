import { useState } from 'react';
import NextImage from 'next/image';

import InfoCircleIcon from '@/public/icons/info-circle.svg';
import Richtext from '@/components/Blocks/Richtext';

export default function Media({
  image = {
    media: null
  },
  className,
  classNameImage,
  classNameCaption,
  showCaption = false,
  ...props
}) {
  if (!image || !image.media) {
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

  const showCaptionAsOverlay = !showCaption;
  const [isCaptionOpen, setIsCaptionOpen] = useState(showCaption);
  const hasCaption = caption || imageCaption;

  return (
    <figure className={`leading-none text-none relative ${className}`}>
      <div className={classNameImage}>{<NextImage {...imageProps} />}</div>

      {!showCaption && hasCaption && (
        <button
          type="button"
          onClick={() => {
            setIsCaptionOpen(!isCaptionOpen);
          }}
          className="absolute bottom-4 left-4"
        >
          <InfoCircleIcon
            className={`w-8 h-auto hover:text-white ${
              isCaptionOpen && 'text-white'
            }`}
          />
        </button>
      )}

      {isCaptionOpen && hasCaption && (
        <figcaption
          className={`font-rubik italic text-2xs px-10 py-5 md:p-5 text-gray-600 font-rubik-features ${classNameCaption} ${
            showCaptionAsOverlay &&
            isCaptionOpen &&
            'absolute -bottom-8 left-16 bg-white z-20'
          }`}
        >
          <Richtext richtext={caption || imageCaption} isSmall />
        </figcaption>
      )}
    </figure>
  );
}
