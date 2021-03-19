export default function Paragraph({ children, isSmall }) {
  return (
    <p
      className={`font-rubik text-base ${
        !isSmall && 'md:text-medium'
      } leading-normal px-8 md:px-0 font-rubik-features`}
    >
      {children}
    </p>
  );
}
