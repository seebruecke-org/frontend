import NextImage from 'next/image';

import HTML from '@/components/HTML';

export default function Image({ image: { caption, description, sourceUrl, details: { width, height } } }) {
  console.log(caption, description);

  return <figure className="leading-none text-none">
    <NextImage src={sourceUrl} width={width} height={height} />

    {(caption || description) && (
      <figcaption className="font-rubik italic text-2xs p-5 text-gray-600">
        <HTML html={description} />
        <HTML html={caption} />
      </figcaption>
    )}
  </figure>
}
