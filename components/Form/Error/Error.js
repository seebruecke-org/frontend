export default function FormError({ message }) {
  return (
    <div className="font-rubik text-small md:absolute md:left-full md:w-72 md:transform md:-translate-y-1/2 md:top-2/4 mb-2 md:mb-0">
      <p className="text-orange-900 md:text-white md:bg-orange-900 md:p-8 rounded-2xl md:ml-8">
        {message}
      </p>
    </div>
  );
}
