import Media from '@/components/Media';

export default function RichtextImage({ src }) {
  return (
    <Media
      image={{ media: { url: src, width: 300, height: 300 } }}
      className="md:float-left md:mr-12 mb-12 md:-ml-16 xl:-ml-48"
      priority
    />
  );
}
