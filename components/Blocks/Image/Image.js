import Image from '@/components/Image';

export default function ImageBlock({ mediaItem }) {
  return <Image image={mediaItem} className="col-start-1 col-span-8" />;
}
