export default function Form({ children, highlight = false, ...props }) {
  return (
    <form
      {...props}
      className={`col-span-full grid grid-layout-primary mt-20 ${
        highlight ? 'bg-turquoise-300 pt-20 pb-32' : 'pb-20'
      }`}
    >
      {children}
    </form>
  );
}
