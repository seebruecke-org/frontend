export default function FederalCountry({
  name,
  count,
  singularKicker,
  pluralKicker
}) {
  return (
    <h3 className="font-brezel text-xl font-bold italic leading-none px-5 py-10">
      <small className="block not-italic font-rubik font-normal text-small mb-4">
        {count} {count === 1 ? singularKicker : pluralKicker}
      </small>

      {name}
    </h3>
  );
}
