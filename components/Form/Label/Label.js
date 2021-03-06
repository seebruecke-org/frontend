export default function Label({ children, ...props }) {
  return (
    <label
      className="font-rubik text-base md:text-medium font-bold leading-tight"
      {...props}
    >
      {children}
    </label>
  );
}
