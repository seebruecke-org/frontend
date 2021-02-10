export default function Help({ children, ...props }) {
  return (
    <p className="font-rubik text-small" {...props}>
      {children}
    </p>
  );
}
