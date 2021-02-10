export default function Row({ children, primaryGrid = true, className }) {
  return (
    <div
      className={`col-span-full ${
        primaryGrid && 'md:col-start-3 md:col-span-7'
      } flex flex-col py-8 px-10 md:px-0 ${className}`}
    >
      {children}
    </div>
  );
}
