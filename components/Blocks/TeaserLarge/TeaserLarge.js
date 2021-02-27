import TeaserLarge from '@/components/Teaser/TeaserLarge';

export default function TeaserLargeBlock({ tType, ...props }) {
  return <TeaserLarge {...props} type={tType} />;
}
