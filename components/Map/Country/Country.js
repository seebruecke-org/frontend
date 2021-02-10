export default function Country({ name }) {
  return (
    <h2 className="font-brezel text-medium font-light italic leading-none px-5 py-10 text-gray-600 relative text-center">
      <span className="absolute top-2/4 left-0 w-full h-1 border-t border-gray-600" />
      <span className="bg-white relative px-16">{name}</span>
    </h2>
  );
}
