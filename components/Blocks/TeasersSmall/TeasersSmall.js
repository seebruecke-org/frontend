import TeaserSmall from '@/components/Teaser/TeaserSmall';

export default function TeasersSmallBlock({ items }) {
  return (
    <ul className="col-span-full md:col-start-2 md:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 py-10 md:py-24">
      {items.map(({ tsType, title, ...props }, index) => (
        <li key={`teaser-small-${index}-${title}`}>
          <TeaserSmall {...props} title={title} type={tsType} />
        </li>
      ))}
    </ul>
  );
}
