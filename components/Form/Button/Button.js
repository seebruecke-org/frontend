export default function Button({ children, type = 'submit', ...props }) {
  return (
    <button
      type={type}
      className="bg-black text-white text-base font-rubik font-bold uppercase rounded-xl py-4 px-10 self-start"
      {...props}
    >
      {children}
    </button>
  );
}
