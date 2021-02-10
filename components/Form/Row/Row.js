export default function Row({ children }) {
  return (
    <div className="col-span-full md:col-start-3 md:col-span-7 flex flex-col py-8 px-10 md:px-0">
      {children}
    </div>
  );
}
