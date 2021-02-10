export default function Button({ children, type = 'submit', ...props }) {
  return (
    <button
      type={type}
      className="bg-black hover:bg-white text-white hover:text-black border-black border text-base font-rubik font-bold uppercase rounded-3xl py-4 px-10 self-start"
      {...props}
    >
      {children}
    </button>
  );
}
