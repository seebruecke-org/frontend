export default function FederalCountry({ name, count }) {
  return (
    <h3 className="font-brezel text-xl font-bold italic leading-tight p-5">
      <small className="block not-italic font-rubik font-normal text-small">
        {count}
      </small>

      {name}
    </h3>
  );
}
