import Image from '@/components/Image';

export default function ImageBlock({ media }) {
  return <Image image={media} className="col-start-1 col-span-8" />;
}
