export default function Fieldset({ legend, children, ...props }) {
  return (
    <fieldset
      className="col-span-full md:col-start-3 md:col-span-7 px-10 md:px-0"
      {...props}
    >
      <div className="flex flex-col py-8">
        <legend className="font-rubik text-base md:text-medium font-bold block pb-6">
          {legend}
        </legend>

        {children}
      </div>
    </fieldset>
  );
}
