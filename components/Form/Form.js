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
      className={`col-span-full grid ${primaryGrid && 'grid-layout-primary'} ${
        highlight && 'bg-turquoise-300'
      } ${className}`}
    >
      {children}
    </form>
  );
}
