export default function Form({
  children,
  highlight = false,
  primaryGrid = true,
  className,
  ...props
}) {
  return (
    <form
      {...props}
      className={`col-span-full grid ${
        primaryGrid && 'grid-layout-primary'
      } mt-20 ${
        highlight ? 'bg-turquoise-300 pt-20 pb-32' : 'pb-20'
      } ${className}`}
    >
      {children}
    </form>
  );
}
