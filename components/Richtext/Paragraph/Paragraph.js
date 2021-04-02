export default function Paragraph({ children, size = 'regular' }) {
  let sizeClassName = 'text-base md:text-medium';

  switch (size) {
    case 'small':
      sizeClassName = 'text-base';
      break;

    case 'tiny':
      sizeClassName = 'text-xs';
      break;
  }

  return (
    <p
      className={`font-rubik ${sizeClassName} leading-normal px-8 md:px-0 font-rubik-features`}
    >
      {children}
    </p>
  );
}
