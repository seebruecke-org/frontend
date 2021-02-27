export default function Form({
  children,
  highlight = false,
  primaryGrid = true,
  padded = false,
  className,
  ...props
}) {
  return (
    <form
      {...props}
      className={`col-span-full grid ${primaryGrid && 'grid-layout-primary'} ${
        highlight && 'bg-turquoise-300'
      } ${padded && 'py-12 md:py-20'} ${className}`}
    >
      {children}
    </form>
  );
}
