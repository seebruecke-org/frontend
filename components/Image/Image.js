import NextImage from 'next/image';

export default function Image({ image: { caption, description, sourceUrl, details: { width, height } } }) {
  return <figure>
    <NextImage src={sourceUrl} width={width} height={height} />

    {caption || description && (
      <figcaption>
        {description} {caption}
      </figcaption>
    )}
  </figure>
}
